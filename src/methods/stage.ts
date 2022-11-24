import fs from 'fs';
import path from 'path';
import { ActorSubclass } from '@dfinity/agent';
import { _SERVICE as OrigynNftCanister } from '../idl/origyn_nft_reference.did.d.js';
import { getOrigynNftActor } from './actor.js';
import { Principal } from '@dfinity/principal';
import { formatBytes, wait } from '../utils/index.js';
import { ConfigFile } from '../types/config.js';
import { Metrics, StageArgs } from '../types/stage.js';
import { LibraryFile, Meta, MetadataClass, TextValue } from '../types/metadata.js';
import { getLibraryMetadata } from './metadata.js';
import { log } from './logger.js';
import * as constants from '../constants/index.js';

export async function stage(args: StageArgs) {
  log(`\n${constants.LINE_DIVIDER_SUBCOMMAND}\n`);
  log('Started (stage subcommand)');

  // *** validate args
  if (!['local', 'ic'].includes(args.environment)) {
    const err = `Invalid environment (-e): "${args.environment}". Valid values are "local" (localhost) and "ic" (mainnet).`;
  }

  if (!args.folderPath) {
    throw 'Missing folder argument (-f) with the path to the folder containing the NFT assets.';
  }

  let configFilePath = path.join(args.folderPath, '..', constants.STAGE_FOLDER, constants.CONFIG_FILE_NAME);
  if (!fs.existsSync(configFilePath)) {
    const err = `Configuration file not found at path: '${configFilePath}'`;
    throw err;
  }

  // *** Read data from config file
  const json = fs.readFileSync(configFilePath).toString();
  const config = JSON.parse(json) as ConfigFile;

  const isLocal = args.environment === 'local';
  const actor = await getOrigynNftActor(isLocal, args.keyFilePath || 'seed.txt', config.settings.args.nftCanisterId);

  // *** Stage NFTs and Library Assets
  // nfts and collections have the same metadata structure
  // the difference is that collections have an empty string for the id
  // so the library assets/files can be shared by multiple NFTs
  const metrics: Metrics = { totalFileSize: 0 };
  const items = [config.collection, ...config.nfts];
  for (const nftOrColl of items) {
    var tokenId = (nftOrColl?.meta?.metadata?.Class.find((c) => c.name === 'id')?.value as TextValue)?.Text?.trim();

    // Stage NFT
    log(`\n${constants.LINE_DIVIDER_SECTION}`);
    log(`\nStaging metadata for ${tokenId ? 'NFT ' + tokenId : 'Collection'}\n`);
    const metadataToStage = deserializeConfig(nftOrColl.meta);

    //console.log(metadataToStage);
    const stageResult = await actor.stage_nft_origyn(metadataToStage);
    log(JSON.stringify(stageResult));

    // *** Stage Library Assets (as chunks)
    for (const libraryFile of nftOrColl.library) {
      await stageLibraryAsset(actor, config.settings.stageFolder, nftOrColl, libraryFile, tokenId, metrics);
    }
  }

  log(`\nTotal Staged File Size: ${metrics.totalFileSize} (${formatBytes(metrics.totalFileSize)})\n`);

  log('\nFinished (stage subcommand)\n');
  log(`${constants.LINE_DIVIDER_SUBCOMMAND}\n`);
}

function deserializeConfig(config) {
  // Iterates config object tree and converts all
  // string values representing a Principal or Nat
  // to a Principal object or BigInt respectively.

  if (typeof config !== 'object') {
    return config;
  }
  for (var p in config) {
    switch (typeof config[p]) {
      case 'object':
        // recurse objects
        config[p] = deserializeConfig(config[p]);
        break;
      case 'string':
        if (p === 'Principal') {
          config[p] = Principal.fromText(config[p]);
        } else if (p === 'Nat') {
          config[p] = BigInt(config[p]);
        }
        break;
    }
  }
  return config;
}

async function stageLibraryAsset(
  actor: ActorSubclass<OrigynNftCanister>,
  stageFolder: string,
  nftOrColl: Meta,
  libraryAsset: LibraryFile,
  tokenId: string,
  metrics: Metrics,
) {
  log(`\n${constants.LINE_DIVIDER_SECTION}`);
  log(`\nStaging asset: ${libraryAsset.library_id}`);
  log(`\nFile path: ${libraryAsset.library_file}`);

  const fileData = fs.readFileSync(path.join(stageFolder, libraryAsset.library_file));

  // slice file buffer into chunks of bytes that fit into the chunk size
  const fileSize = fileData.length;
  const chunkCount = Math.ceil(fileSize / constants.MAX_CHUNK_SIZE);
  log(`max chunk size ${constants.MAX_CHUNK_SIZE}`);
  log(`file size ${fileSize}`);
  log(`chunk count ${chunkCount}`);

  const libraryMetadata = getLibraryMetadata(stageFolder, nftOrColl, libraryAsset, fileSize);

  for (let i = 0; i < chunkCount; i++) {
    // give the canister a 3 second break after every 10 chunks
    // attempt to prevent error: IC0515: Certified state is not available yet. Please try again…
    if (i > 0 && i % 10 === 0) {
      await wait(3000);
    }

    // library metadata is only sent with the first chunk
    await uploadChunk(actor, libraryAsset.library_id, tokenId, fileData, i, metrics, i === 0 ? libraryMetadata : undefined);
  }
}

async function uploadChunk(
  actor: ActorSubclass<OrigynNftCanister>,
  libraryId: string,
  tokenId: string,
  fileData: Buffer,
  chunkNumber: number,
  metrics: Metrics,
  metadata?: any,
  retries = 0,
) {
  const start = chunkNumber * constants.MAX_CHUNK_SIZE;
  const end = start + constants.MAX_CHUNK_SIZE > fileData.length ? fileData.length : start + constants.MAX_CHUNK_SIZE;

  const chunk = fileData.slice(start, end);

  log(`\nchunk ${chunkNumber}:`);
  log(`start ${start}`);
  log(`end ${end}`);
  log(`size ${chunk.length}`);
  log(`array size ${Array.from(chunk).length}`);

  try {
    // *** Stage Library Asset
    let result = await actor.stage_library_nft_origyn({
      token_id: tokenId,
      library_id: libraryId,
      filedata: metadata ?? { Empty: null },
      chunk: BigInt(chunkNumber),
      content: Array.from(chunk),
    });
    log(`result ${JSON.stringify(result)}`);
    metrics.totalFileSize += chunk.length;
    log(`Cumulative staged file size: ${metrics.totalFileSize} (${formatBytes(metrics.totalFileSize)})`);
  } catch (ex: any) {
    if (retries >= 5) {
      log(
        `\nMax retries of ${constants.MAX_CHUNK_UPLOAD_RETRIES} has been reached for ${libraryId} chunk #${chunkNumber}.\n`,
      );
    } else {
      log('\n' + ex.toString());
      log('\n*** Caught the above error while staging a library asset chunk. Waiting 3 seconds, then trying again.\n');
      await wait(3000);
      retries++;
      await uploadChunk(actor, libraryId, tokenId, fileData, chunkNumber, metrics, metadata, retries);
    }
  }
}
