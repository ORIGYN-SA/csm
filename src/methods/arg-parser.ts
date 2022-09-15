import { AssetTypeMap, ConfigArgs } from '../types/config';
import { MintArgs } from '../types/mint';
import { StageArgs } from '../types/stage';

export function parseConfigArgs(argv: string[]): ConfigArgs {
  const nftCanisterId = getArgValue(argv, ['-i', '--nftCanisterId']);

  const args: ConfigArgs = {
    environment: getArgValue(argv, ['-e', '--environment']),
    collectionId: getArgValue(argv, ['-c', '--collectionId']),
    collectionDisplayName: getArgValue(argv, ['-d', '--collectionDisplayName']),
    tokenPrefix: getArgValue(argv, ['-t', '--tokenPrefix']),
    nftCanisterId,
    creatorPrincipal: getArgValue(argv, ['-p', '--creatorPrincipal']),
    namespace: getArgValue(argv, ['-n', '--namespace']),
    folderPath: getArgValue(argv, ['-f', '--folderPath']),
    assetMappings: getArgValue(argv, ['-m', '--assetMappings']),
    //optional args
    nftOwnerId: getArgValue(argv, ['-o', '--nftOwnerId'], nftCanisterId),
    soulbound: getArgValue(argv, ['-s', '--soulbound'], 'false'),
    nftQuantities: getArgValue(argv, ['-q', '--nftQuantities']),
  };

  // validate args
  if (!args.environment) {
    throw 'Missing environment argument (-e).';
  } else if (!args.collectionId) {
    throw 'Missing collection id argument (-c) with the id of the collection used in the URL and __apps section.';
  } else if (!args.collectionDisplayName) {
    throw 'Missing collection display name argument (-d).';
  } else if (!args.tokenPrefix) {
    throw 'Missing token prefix argument (-t).';
  } else if (!args.nftCanisterId) {
    throw 'Missing canister id argument (-i).';
  } else if (!args.creatorPrincipal) {
    throw 'Missing creator principal id argument (-p).';
  } else if (!args.namespace) {
    throw 'Missing namespace argument (-n).';
  } else if (!args.folderPath) {
    throw 'Missing folder path argument (-f) with the path to the folder containing the NFT assets.';
  } else if (!args.assetMappings) {
    throw 'Missing NFT argument/s (-m) with a comma delimited list of asset type to file name mappings.';
  }

  return args;
}

export function parseStageArgs(argv: string[]): StageArgs {
  const args: StageArgs = {
    folderPath: getArgValue(argv, ['-f', '--folderPath']),
    seedFilePath: getArgValue(argv, ['-s', '--seedFilePath']),
  };

  // validate args
  if (!args.folderPath) {
    throw 'Missing folder path argument (-f) with the path to the folder containing the NFT assets.';
  } else if (!args.seedFilePath) {
    throw 'Missing seed file path argument (-s)';
  }

  return args;
}

export function parseMintArgs(argv: string[]): MintArgs {
  const args: MintArgs = {
    folderPath: getArgValue(argv, ['-f', '--folderPath']),
    seedFilePath: getArgValue(argv, ['-s', '--seedFilePath']),
    range: getArgValue(argv, ['-r', '--range']),
    batchSize: getArgValue(argv, ['-b', '--batchSize']),
  };

  // validate args
  if (!args.folderPath) {
    throw 'Missing folder path argument (-f) with the path to the folder containing the NFT assets.';
  } else if (!args.seedFilePath) {
    throw 'Missing seed file path argument (-s)';
  } else if (!args.range) {
    throw 'Missing mint range argument (-r)';
  } else if (!args.batchSize) {
    throw 'Missing batch size argument (-b)';
  }

  return args;
}
export function parseAssetTypeMapPatterns(patterns: string): AssetTypeMap {
  // parses (with validation):
  // 'primary:index#.html, experience:index#.html, preview:preview#.png'
  // to:
  // { primary: 'index#.html', experience: 'index#.html', preview: 'preview#.png' }

  const assetTypeMapPatterns = {};

  patterns
    .split(/\s?,\s?/)
    .map((n) => n.split(/\s?:\s?/))
    .forEach((m) => {
      console.log('m', m);
      if (m.length != 2) {
        const err = `Invalid syntax for mapping asset types to file names. ${m}`;
        throw err;
      }

      const assetType = m[0].trim().toLowerCase();
      const fileName = m[1].trim();

      if (!['primary', 'preview', 'experience', 'hidden'].includes(assetType)) {
        const err = `Invalid asset type '${assetType}'. Valid types are: 'primary', 'preview', 'experience' and 'hidden'.`;
        throw err;
      }

      assetTypeMapPatterns[assetType] = fileName;
    });

  return assetTypeMapPatterns;
}

function getArgValue(argv: string[], argNames: string[], defaultValue: string = '') {
  const index = argv.findIndex((arg) => argNames.includes(arg.toLocaleLowerCase()));
  if (index > -1 && argv.length - 1 > index) {
    const value = argv[index + 1];
    if (!value.startsWith('-')) {
      return value.trim() || defaultValue;
    }
  }
  return defaultValue;
}
