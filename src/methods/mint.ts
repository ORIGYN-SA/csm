import fs from 'fs';
import path from 'path';
import { getActor } from './actor';
import { Principal } from '@dfinity/principal';
import { ConfigFile } from '../types/config';
import { MintArgs } from '../types/mint';
import { TextValue } from '../types/metadata';
import { log } from './logger';
import * as constants from '../constants';

export async function mint(args: MintArgs) {
  log(`\n${constants.LINE_DIVIDER_SUBCOMMAND}\n`);
  log('Started (mint subcommand)');

  // *** validate args
  let mintRange: number[] | null = null;
  if (args.range) {
    const ranges = args.range.split('-');
    if (ranges.length !== 2 || isNaN(parseInt(ranges[0])) || isNaN(parseInt(ranges[1]))) {
      const err = `Invalid mint range (-r): ${args.range}. Must use format: 0-5`;
      throw err;
    } else {
      mintRange = [parseInt(ranges[0]), parseInt(ranges[1])];
    }
  }

  let batchSize: number = 0;
  if (!args.batchSize) {
    batchSize = constants.DEFAULT_MINT_BATCH_SIZE;
  } else if (isNaN(parseInt(args.batchSize || ''))) {
    const err = `Invalid mint batch size (-b): ${args.batchSize}. Must be an integer.`;
    throw err;
  } else {
    batchSize = parseInt(args.batchSize || '');
  }

  let configFilePath = path.join(args.folderPath, '..', constants.STAGE_FOLDER, constants.CONFIG_FILE_NAME);
  if (!fs.existsSync(configFilePath)) {
    const err = `Configuration file not found at path: '${configFilePath}'`;
    throw err;
  }

  // *** Read data from config file
  const json = fs.readFileSync(configFilePath).toString();
  const config = JSON.parse(json) as ConfigFile;

  const isProd = (config.settings.args.environment?.[0] || '').toLowerCase() !== 'l';
  const actor = await getActor(isProd, args.keyFilePath || 'seed.txt', config.settings.args.nftCanisterId);

  // *** Mint NFTs
  mintRange = mintRange || [0, config.nfts.length - 1];
  const principalText = Principal.fromText(config.settings.args.creatorPrincipal);

  // only mint if the token index is within the specified range
  for (let i = mintRange[0]; i <= mintRange[1]; i += batchSize) {
    const nftsToMint = config.nfts.slice(i, Math.min(i + batchSize, mintRange[1] + 1)).map((nft) => {
      var tokenId = (nft?.meta?.metadata?.Class.find((c) => c.name === 'id')?.value as TextValue)?.Text?.trim();
      return [tokenId, { principal: principalText }];
    });

    const tokenIds = nftsToMint.map((nft) => nft[0]).join(', ');
    log(`\n${constants.LINE_DIVIDER_SECTION}`);
    log(`\nMinting ${nftsToMint.length} NFTs '${tokenIds}'`);

    let result = await actor.mint_batch_nft_origyn(nftsToMint);

    log(JSON.stringify(result));

    log(`\nSuccessfully minted ${nftsToMint.length} NFTs.\n`);
  }

  log('\nFinished (mint subcommand)\n');
  log(`${constants.LINE_DIVIDER_SUBCOMMAND}\n`);
}
