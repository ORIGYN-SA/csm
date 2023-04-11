import { AssetTypeMap, ConfigArgs, CustomRoyaltyRate } from '../types/config.js';
import { MintArgs } from '../types/mint.js';
import { StageArgs } from '../types/stage.js';
//import { GOV_CANISTER_ID } from '../constants/index.js';
const GOV_CANISTER_ID = 'a3lu7-uiaaa-aaaaj-aadnq-cai';

export function parseConfigArgs(argv: string[]): ConfigArgs {
  const creatorPrincipal = getArgValue(argv, ['--creatorPrincipal']);

  const args: ConfigArgs = {
    collectionId: getArgValue(argv, ['--collectionId']),
    displayName: getArgValue(argv, ['--displayName', '--collectionDisplayName']),
    description: getArgValue(argv, ['--description', '--collectionDescription']),
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
    primaryOriginatorRate: getArgValue(argv, ['--primaryOriginatorRate']),
    primaryBrokerRate: getArgValue(argv, ['--primaryBrokerRate']),
    primaryNodeRate: getArgValue(argv, ['--primaryNodeRate']),
    primaryNetworkRate: getArgValue(argv, ['--primaryNetworkRate']),
    primaryCustomRates: getArgValue(argv, ['--primaryCustomRates']),

    // secondary royalties
    secondaryOriginatorRate: getArgValue(argv, ['--secondaryOriginatorRate']),
    secondaryBrokerRate: getArgValue(argv, ['--secondaryBrokerRate']),
    secondaryNodeRate: getArgValue(argv, ['--secondaryNodeRate']),
    secondaryNetworkRate: getArgValue(argv, ['--secondaryNetworkRate']),
    secondaryCustomRates: getArgValue(argv, ['--secondaryCustomRates']),
  };

  // validate args
  if (!args.collectionId) {
    throw 'Missing collection id argument (--collectionId) with the id of the collection used in the URL and __apps section.';
  } else if (!args.displayName) {
    throw 'Missing display name argument (--displayName).';
  } else if (!args.nftCanisterId) {
    throw 'Missing canister id argument (--nftCanisterId).';
  } else if (!args.creatorPrincipal) {
    throw 'Missing creator principal id argument (--creatorPrincipal).';
  } else if (!args.folderPath) {
    throw 'Missing folder path argument (--folderPath) with the path to the folder containing the file assets.';
  } else if (!args.assetMappings) {
    throw 'Missing asset mappings (--assetMappings) with a comma delimited list of asset type to file name mappings.';
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
    throw 'Missing environment argument (--environment).';
  } else if (!args.folderPath) {
    throw 'Missing folder path argument (--folderPath) with the path to the folder containing the file assets.';
  } else if (!args.keyFilePath) {
    throw 'Missing key file path argument (--keyFilePath)';
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
    throw 'Missing environment argument (--environment).';
  } else if (!args.folderPath) {
    throw 'Missing folder path argument (--folderPath) with the path to the folder containing the file assets.';
  } else if (!args.keyFilePath) {
    throw 'Missing key file path argument (--keyFilePath)';
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

export function getArgValue(argv: string[], argNames: string[], defaultValue: string = '') {
  const index = argv.findIndex((arg) => argNames.map((n) => n.toLowerCase()).includes(arg.toLocaleLowerCase()));
  if (index > -1 && argv.length - 1 > index) {
    const value = argv[index + 1];
    if (!value.startsWith('-')) {
      return value.trim() || defaultValue;
    }
  }
  return defaultValue;
}
