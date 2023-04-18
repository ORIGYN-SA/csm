import fs from 'fs';
import path from 'path';
import { getOrigynNftActor } from './actor.js';
import { Principal } from '@dfinity/principal';
import type { ConfigFile } from '../types/config.js';
import type { MintArgs } from '../types/mint.js';
import type { TextValue } from '../types/metadata.js';
import type { Account } from '../idl/origyn_nft_reference.did.d.js';
import { log } from './logger.js';
import * as constants from '../constants/index.js';

export async function mint(args: MintArgs): Promise<void> {
  log(`\n${constants.LINE_DIVIDER_SUBCOMMAND}\n`);
  log('Started (mint subcommand)');

  // *** validate args
  if (!['local', 'ic'].includes(args.environment)) {
    const err = `Invalid environment (-e): "${args.environment}". Valid values are "local" (localhost) and "ic" (mainnet).`;
    throw new Error(err);
  }

  let mintRange: number[] | null = null;
  if (args.range) {
    const ranges = args.range.split('-');
    if (ranges.length !== 2 || isNaN(parseInt(ranges[0], 10)) || isNaN(parseInt(ranges[1], 10))) {
      const err = `Invalid mint range (-r): ${args.range}. Must use format: 0-5`;
      throw new Error(err);
    } else {
      mintRange = [parseInt(ranges[0], 10), parseInt(ranges[1], 10)];
    }
  }

  let batchSize: number = 0;
  if (!args.batchSize) {
    batchSize = constants.DEFAULT_MINT_BATCH_SIZE;
  } else if (isNaN(parseInt(args.batchSize || '', 10))) {
    const err = `Invalid mint batch size (-b): ${args.batchSize}. Must be an integer.`;
    throw new Error(err);
  } else {
    batchSize = parseInt(args.batchSize || '', 10);
  }

  const configFilePath = path.join(args.folderPath, '..', constants.STAGE_FOLDER, constants.CONFIG_FILE_NAME);
  if (!fs.existsSync(configFilePath)) {
    const err = `Configuration file not found at path: '${configFilePath}'`;
    throw new Error(err);
  }

  // *** Read data from config file
  const json = fs.readFileSync(configFilePath).toString();
  const config = JSON.parse(json) as ConfigFile;

  const isLocal = args.environment === 'local';
  const actor = await getOrigynNftActor(config.settings.args.nftCanisterId, args.keyFilePath, isLocal);

  // *** Mint NFTs
  mintRange = mintRange ?? [0, config.nfts.length - 1];
  const principal = Principal.fromText(config.settings.args.creatorPrincipal);

  // only mint if the token index is within the specified range
  for (let i = mintRange[0]; i <= mintRange[1]; i += batchSize) {
    const nftsToMint = config.nfts.slice(i, Math.min(i + batchSize, mintRange[1] + 1)).map((nft) => {
      const tokenId: string = (
        nft?.meta?.metadata?.Class.find((c) => c.name === 'id')?.value as TextValue
      )?.Text?.trim();
      const account: Account = { principal };
      return [tokenId, account] as [string, Account];
    });

    const tokenIds = nftsToMint.map((nft) => nft[0]).join(', ');
    log(`\n${constants.LINE_DIVIDER_SECTION}`);
    log(`\nMinting ${nftsToMint.length} NFTs '${tokenIds}'`);

    const result = await actor.mint_batch_nft_origyn(nftsToMint);
    log(JSON.stringify(result));

    log(`\nSuccessfully minted ${nftsToMint.length} NFTs.\n`);
  }

  log('\nFinished (mint subcommand)\n');
  log(`${constants.LINE_DIVIDER_SUBCOMMAND}\n`);
}
