import { AssetTypeMap, ConfigArgs, CustomRoyaltyRate} from '../types/config.js';
import { MintArgs } from '../types/mint.js';
import { StageArgs } from '../types/stage.js';
//import { GOV_CANISTER_ID } from '../constants/index.js';
const GOV_CANISTER_ID = 'a3lu7-uiaaa-aaaaj-aadnq-cai';

export function parseConfigArgs(argv: string[]): ConfigArgs {
  const creatorPrincipal = getArgValue(argv, ['-p', '--creatorPrincipal']);

  const args: ConfigArgs = {
    collectionId: getArgValue(argv, ['--collectionId']),
    displayName: getArgValue(argv, ['--displayName', '--collectionDisplayName']),
    description: getArgValue(argv, ['--description', '--collectionDescription']),
    tokenPrefix: getArgValue(argv, ['--tokenPrefix']),
    tokenWords: getArgValue(argv, ['--tokenWords']),
    minWords: getArgValue(argv, ['--minWords'], "3"),
    maxWords: getArgValue(argv, ['--maxWords'], "3"),
    nftCanisterId: getArgValue(argv, ['--nftCanisterId']),
    creatorPrincipal,
    folderPath: getArgValue(argv, ['--folderPath']),
    assetMappings: getArgValue(argv, ['--assetMappings']),

    //optional args
    nftOwnerId: getArgValue(argv, ['--nftOwnerId'], creatorPrincipal),
    soulbound: getArgValue(argv, ['--soulbound'], 'false'),
    nftQuantities: getArgValue(argv, ['--nftQuantities']),

    // payees (for royalties)
    originatorPrincipal: getArgValue(argv, ['--originatorPrincipal'], creatorPrincipal),
    nodePrincipal: getArgValue(argv, ['--nodePrincipal'], GOV_CANISTER_ID),
    networkPrincipal: getArgValue(argv, ['--networkPrincipal'], GOV_CANISTER_ID),
    
    // primary royalties
    primaryOriginatorRate: getArgValue(argv, ['--primaryOriginatorRate'], '0.01'),
    primaryBrokerRate: getArgValue(argv, ['--primaryBrokerRate'], '0.03'),
    primaryNodeRate: getArgValue(argv, ['--primaryNodeRate'], '0.035'),
    primaryNetworkRate: getArgValue(argv, ['--primaryNetworkRate'], '0.005'),
    primaryCustomRates: getArgValue(argv, ['--primaryCustomRates']),

    // secondary royalties
    secondaryOriginatorRate: getArgValue(argv, ['--secondaryOriginatorRate'], '0.01'),
    secondaryBrokerRate: getArgValue(argv, ['--secondaryBrokerRate'], '0.03'),
    secondaryNodeRate: getArgValue(argv, ['--secondaryNodeRate'], '0.035'),
    secondaryNetworkRate: getArgValue(argv, ['--secondaryNetworkRate'], '0.005'),
    secondaryCustomRates: getArgValue(argv, ['--secondaryCustomRates']),
  };

  // validate args
  if (!args.collectionId) {
    throw 'Missing collection id argument (-c) with the id of the collection used in the URL and __apps section.';
  } else if (!args.displayName) {
    throw 'Missing collection display name argument (-d).';
  } else if (!args.tokenPrefix && !args.tokenWords) {
    throw 'Missing token prefix argument (-t) or token words (-w).';
  } else if (!args.nftCanisterId) {
    throw 'Missing canister id argument (-i).';
  } else if (!args.creatorPrincipal) {
    throw 'Missing creator principal id argument (-p).';
  } else if (!args.folderPath) {
    throw 'Missing folder path argument (-f) with the path to the folder containing the NFT assets.';
  } else if (!args.assetMappings) {
    throw 'Missing NFT argument/s (-m) with a comma delimited list of asset type to file name mappings.';
  }

  return args;
}

export function parseStageArgs(argv: string[]): StageArgs {
  const args: StageArgs = {
    environment: getArgValue(argv, ['-e', '--environment']),
    folderPath: getArgValue(argv, ['-f', '--folderPath']),
    keyFilePath: getArgValue(argv, ['-k', '--keyFilePath']),
  };

  // validate args
  if (!args.environment) {
    throw 'Missing environment argument (-e).';
  } else if (!args.folderPath) {
    throw 'Missing folder path argument (-f) with the path to the folder containing the NFT assets.';
  } else if (!args.keyFilePath) {
    throw 'Missing seed file path argument (-s)';
  }

  return args;
}

export function parseMintArgs(argv: string[]): MintArgs {
  const args: MintArgs = {
    environment: getArgValue(argv, ['-e', '--environment']),
    folderPath: getArgValue(argv, ['-f', '--folderPath']),
    keyFilePath: getArgValue(argv, ['-k', '--keyFilePath']),

    // optional
    range: getArgValue(argv, ['-r', '--range']),
    batchSize: getArgValue(argv, ['-b', '--batchSize']),
  };

  // validate args
  if (!args.environment) {
    throw 'Missing environment argument (-e).';
  } else if (!args.folderPath) {
    throw 'Missing folder path argument (-f) with the path to the folder containing the NFT assets.';
  } else if (!args.keyFilePath) {
    throw 'Missing seed file path argument (-s)';
  }

  return args;
}

export function parseAssetTypeMapPatterns(patterns: string): AssetTypeMap {
  // --assetType "primary:nft*.png, preview:preview*.png"

  const assetTypeMapPatterns = {};

  patterns
    .split(/\s?,\s?/)
    .map((n) => n.split(/\s?:\s?/))
    .forEach((m) => {
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

export function parseCustomRates(patterns: string): CustomRoyaltyRate[] {
  let customRates: CustomRoyaltyRate[] = [];
  if (!patterns) {
    return customRates;
  }

  patterns
    .split(/\s?,\s?/)
    .map((n) => n.split(/\s?:\s?/))
    .forEach((m) => {
      if (m.length != 3) {
        const err = `Invalid syntax for custom rates. ${m}`;
        throw err;
      }

      const customName = m[0].trim().toLowerCase();
      const rate = m[1].trim();
      const principalId = m[2].trim();

      if (!principalId || !rate || !customName) {
        const err = 'Custom rate, principal or name not provided!';
        throw err;
      }

      customRates.push({ customName, rate, principalId });
    });

  return customRates;
}

function getArgValue(argv: string[], argNames: string[], defaultValue: string = '') {
  const index = argv.findIndex((arg) => argNames.map((n) => n.toLowerCase()).includes(arg.toLocaleLowerCase()));
  if (index > -1 && argv.length - 1 > index) {
    const value = argv[index + 1];
    if (!value.startsWith('-')) {
      return value.trim() || defaultValue;
    }
  }
  return defaultValue;
}
