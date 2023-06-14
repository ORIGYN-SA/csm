import type { AssetTypeMap, ConfigArgs, CustomRoyaltyRate, Social } from '../types/config.js';
import type { MintArgs } from '../types/mint.js';
import type { StageArgs } from '../types/stage.js';
const GOV_CANISTER_ID = 'a3lu7-uiaaa-aaaaj-aadnq-cai';

export function parseConfigArgs(argv: string[]): ConfigArgs {
  const creatorPrincipal = getArgValue(argv, ['--creatorPrincipal']);

  const args: ConfigArgs = {
    collectionId: getArgValue(argv, ['--collectionId']),
    collectionName: getArgValue(argv, ['--collectionName']),
    collectionSymbol: getArgValue(argv, ['--collectionSymbol']),
    collectionLogoPath: getArgValue(argv, ['--collectionLogoPath']),
    description: getArgValue(argv, ['--description', '--collectionDescription']),
    nftCanisterId: getArgValue(argv, ['--nftCanisterId']),
    creatorPrincipal,
    folderPath: getArgValue(argv, ['--folderPath']),
    assetMappings: getArgValue(argv, ['--assetMappings']),

    // optional args
    nftOwnerId: getArgValue(argv, ['--nftOwnerId'], creatorPrincipal),
    soulbound: getArgValue(argv, ['--soulbound'], 'false'),
    nftQuantities: getArgValue(argv, ['--nftQuantities']),
    socials: getArgValue(argv, ['--socials']),

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
    throw new Error(
      'Missing collection id argument (--collectionId) with the id of the collection used in the URL and __apps section.',
    );
  } else if (!args.collectionName) {
    throw new Error('Missing collection name argument (--collectionName).');
  } else if (!args.collectionSymbol) {
    throw new Error('Missing collection symbol argument (--collectionSymbol).');
  } else if (!args.collectionLogoPath) {
    throw new Error(
      'Missing collection logo path argument (--collectionLogoPath) with the path to the image file containing the logo.',
    );
  } else if (!args.nftCanisterId) {
    throw new Error('Missing canister id argument (--nftCanisterId).');
  } else if (!args.creatorPrincipal) {
    throw new Error('Missing creator principal id argument (--creatorPrincipal).');
  } else if (!args.folderPath) {
    throw new Error(
      'Missing folder path argument (--folderPath) with the path to the folder containing the file assets.',
    );
  } else if (!args.assetMappings) {
    throw new Error(
      'Missing asset mappings (--assetMappings) with a comma delimited list of asset type to file name mappings.',
    );
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
    throw new Error('Missing environment argument (--environment).');
  } else if (!args.folderPath) {
    throw new Error(
      'Missing folder path argument (--folderPath) with the path to the folder containing the file assets.',
    );
  } else if (!args.keyFilePath) {
    throw new Error('Missing key file path argument (--keyFilePath)');
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
    throw new Error('Missing environment argument (--environment).');
  } else if (!args.folderPath) {
    throw new Error(
      'Missing folder path argument (--folderPath) with the path to the folder containing the file assets.',
    );
  } else if (!args.keyFilePath) {
    throw new Error('Missing key file path argument (--keyFilePath)');
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
      if (m.length !== 2) {
        const err = `Invalid syntax for mapping asset types to file names. ${JSON.stringify(m, null, 2)}`;
        throw new Error(err);
      }

      const assetType = m[0].trim().toLowerCase();
      const fileName = m[1].trim();

      if (!['primary', 'preview', 'experience', 'hidden'].includes(assetType)) {
        const err = `Invalid asset type '${assetType}'. Valid types are: 'primary', 'preview', 'experience' and 'hidden'.`;
        throw new Error(err);
      }

      assetTypeMapPatterns[assetType] = fileName;
    });

  return assetTypeMapPatterns;
}

export function parseCustomRates(patterns: string): CustomRoyaltyRate[] {
  const customRates: CustomRoyaltyRate[] = [];
  if (!patterns) {
    return customRates;
  }

  patterns
    .split(/\s?,\s?/)
    .map((n) => n.split(/\s?:\s?/))
    .forEach((m) => {
      if (m.length !== 3) {
        const err = `Invalid syntax for custom rates. ${JSON.stringify(m, null, 2)}`;
        throw new Error(err);
      }

      const customName = m[0].trim().toLowerCase();
      const rate = m[1].trim();
      const principalId = m[2].trim();

      if (!principalId || !rate || !customName) {
        throw new Error('Custom rate, principal or name not provided!');
      }

      customRates.push({ customName, rate, principalId });
    });

  return customRates;
}

export function parseSocials(patterns: string): Social[] {
  const socials: Social[] = [];
  if (!patterns) {
    return socials;
  }

  patterns
    .split(/\s?,\s?/)
    .map((n) => n.split(/\s?:\s?/))
    .forEach((m) => {
      if (m.length !== 2) {
        const err = `Invalid syntax for social urls. ${JSON.stringify(m, null, 2)}`;
        throw new Error(err);
      }

      const name = m[0].trim().toLowerCase();
      const url = m[1].trim();

      if (!name || !url) {
        throw new Error('Socials, name or url not provided!');
      }

      socials.push({ name, url });
    });

  return socials;
}

export function getArgValue(argv: string[], argNames: string[], defaultValue: string = ''): string {
  const index = argv.findIndex((arg) => argNames.map((n) => n.toLowerCase()).includes(arg.toLocaleLowerCase()));
  if (index > -1 && argv.length - 1 > index) {
    const value = argv[index + 1];
    if (!value.startsWith('-')) {
      return value.trim() || defaultValue;
    }
  }
  return defaultValue;
}
