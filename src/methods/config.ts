import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import * as utils from '../utils/index.js';
import { lookup } from 'mrmime';
import type {
  AssetTypeMap,
  ConfigArgs,
  ConfigSummary,
  ConfigFile,
  ConfigSettings,
  FileInfoMap,
  Royalties,
  Social,
} from '../types/config.js';
import type {
  LibraryFile,
  MetadataClass,
  MetaWithLibrary,
  TextValue,
  NatValue,
  LocationType,
  BoolValue,
} from '../types/metadata.js';
import { parseAssetTypeMapPatterns, parseCustomRates, parseSocials } from './arg-parser.js';
import { getSubFolders, flattenFiles, copyFolder, findUrls } from '../utils/index.js';
import { log } from './logger.js';
import * as constants from '../constants/index.js';
import type { PropertyShared } from '../idl/origyn_nft_reference.did.d.js';
import { Principal } from '@dfinity/principal';

export function config(args: ConfigArgs): string {
  // config object
  const settings = initConfigSettings(args) as any;

  log(constants.LINE_DIVIDER_SECTION);
  log('\nCreating metadata for the collection\n');
  const collectionMetadata = configureCollectionMetadata(settings);

  log(constants.LINE_DIVIDER_SECTION);
  log('\nCreating metadata for the NFTs\n');
  const nftsMetadata = configureNftsMetadata(settings);

  log(`\n${constants.LINE_DIVIDER_SECTION}\n`);

  // build config summary
  const summary: ConfigSummary = {
    totalFilesFound: Object.keys(settings.fileMap).length,
    totalFileSize: `${settings.totalFileSize} (${utils.formatBytes(settings.totalFileSize)})`,
    totalNftDefinitionCount: settings.nftDefinitionCount,
    totalNftCount: settings.totalNftCount,
  };

  const outputFilePath = path.join(settings.stageFolder, constants.CONFIG_FILE_NAME);

  // output definition file
  log('Creating config file with metadata...');
  fse.ensureDirSync(path.dirname(outputFilePath));

  const configFileData = buildConfigFileData(settings, summary, collectionMetadata, nftsMetadata);
  fs.writeFileSync(outputFilePath, JSON.stringify(configFileData, null, 2));
  log('Config file with metadata created');

  log(`\n${constants.LINE_DIVIDER_SECTION}\n`);

  log('Config Summary:\n');
  log(`Total Files Found: ${summary.totalFilesFound}`);
  log(`Total File Size: ${summary.totalFileSize}`);
  log(`Total NFT Definition Count: ${summary.totalNftDefinitionCount}`);
  log(`Total NFT Count: ${summary.totalNftCount}`);
  log(`Metadata File: '${outputFilePath}'`);

  log('\nFinished (config subcommand)\n');
  log(`${constants.LINE_DIVIDER_SUBCOMMAND}\n`);

  return outputFilePath;
}

function getTokenIds(folderPath: string): string[] {
  const fileName = 'token-ids.json';
  const filePath = path.join(folderPath, fileName);

  if (!fse.existsSync(filePath)) {
    throw new Error(`Expected to find a '${fileName}' file at ${folderPath}`);
  }

  const tokenIds = JSON.parse(fs.readFileSync(filePath).toString());

  if (!Array.isArray(tokenIds)) {
    throw new Error('Token IDs is not an array.');
  }

  if (!tokenIds.every((id) => typeof id === 'string')) {
    throw new Error('Token IDs array contains non-string values.');
  }

  return tokenIds as string[];
}

function initConfigSettings(args: ConfigArgs): ConfigSettings {
  const tokenIds = getTokenIds(args.folderPath);

  const assetTypeMapPatterns = parseAssetTypeMapPatterns(args.assetMappings);

  let nftQuantities: number[] = [];
  if (args.nftQuantities) {
    nftQuantities = args.nftQuantities.split(',').map((q) => Number(q.trim()));
  }

  const socials: Social[] = args.socials ? parseSocials(args.socials) : [];

  const stageFolder = path.join(args.folderPath, '..', constants.STAGE_FOLDER);
  copyFolder(args.folderPath, stageFolder);

  const subFolders = getSubFolders(stageFolder);
  let collectionFolder = subFolders.find((f) => path.basename(f).toLowerCase() === constants.COLLECTION_FOLDER) ?? '';

  if (!collectionFolder) {
    const error = `Expected to find a '${constants.COLLECTION_FOLDER}' folder at ${path.relative(
      stageFolder,
      path.join(args.folderPath, constants.COLLECTION_FOLDER),
    )}`;
    throw new Error(error);
  }

  let nftsFolder = subFolders.find((f) => path.basename(f).toLowerCase() === constants.NFTS_FOLDER) ?? '';

  if (!nftsFolder) {
    const error = `Expected to find an '${constants.NFTS_FOLDER}' folder at ${path.relative(
      stageFolder,
      path.join(args.folderPath, constants.NFTS_FOLDER),
    )}`;
    throw new Error(error);
  }

  let nftFolderNames: string[] = [];
  if (nftsFolder) {
    nftFolderNames = getSubFolders(nftsFolder)
      .map((f) => path.basename(f))
      .filter((n) => !Number.isNaN(parseInt(n, 10)))
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }

  const nftDefinitionCount = nftFolderNames.length;
  if (nftDefinitionCount === 0) {
    const error = `No NFT definitions found. Please create a folder under the '${constants.NFTS_FOLDER}' folder for each NFT definition and name it with the index of the NFT starting with 0.`;
    throw new Error(error);
  }

  for (let i = 1; i <= nftDefinitionCount; i++) {
    if (i !== parseInt(nftFolderNames[i - 1], 10)) {
      const error = `The ${constants.NFTS_FOLDER} folder's subfolders must be numbered in sequence starting at 1. Missing folder ${i}.'`;
      throw new Error(error);
    }
  }

  if (nftQuantities?.length && nftDefinitionCount !== nftQuantities.length) {
    const error = `Error: Count mismatch: ${nftDefinitionCount} NFT folders and ${nftQuantities.length} quantities (-q arg).`;
    throw new Error(error);
  }

  let totalNftCount = 0;
  if (nftQuantities.length) {
    // get the total NFT count - needed in metadata of NFT
    for (let i = 1; i <= nftDefinitionCount; i++) {
      // default to one if no quantities specified
      totalNftCount += nftQuantities[i - 1] || 1;
    }
  }

  totalNftCount = nftQuantities?.length ? totalNftCount : nftDefinitionCount;

  if (collectionFolder) {
    collectionFolder = path.relative(stageFolder, collectionFolder);
  }
  if (nftsFolder) {
    nftsFolder = path.relative(stageFolder, nftsFolder);
  }

  const royalties: Royalties = {
    payees: {
      originator: args.originatorPrincipal,
      node: args.nodePrincipal,
      network: args.networkPrincipal,
    },
    rates: {
      primary: {
        originator: args.primaryOriginatorRate,
        broker: args.primaryBrokerRate,
        node: args.primaryNodeRate,
        network: args.primaryNetworkRate,
        custom: parseCustomRates(args.primaryCustomRates),
      },
      secondary: {
        originator: args.secondaryOriginatorRate,
        broker: args.secondaryBrokerRate,
        node: args.secondaryNodeRate,
        network: args.secondaryNetworkRate,
        custom: parseCustomRates(args.secondaryCustomRates),
      },
    },
  };

  const settings: ConfigSettings = {
    args,
    tokenIds,
    assetTypeMapPatterns,
    stageFolder,
    collectionFolder,
    nftsFolder,
    socials,
    nftDefinitionCount,
    nftQuantities,
    totalNftCount,
    fileMap: {},
    collectionLibraries: [],
    totalFileSize: 0,
    royalties,
  };

  // build collection (resource library) metadata objects for all files
  // all files need to be uploaded to the canister
  settings.fileMap = buildFileMap(settings);

  return settings;
}

function getResourceUrl(resourceName: string, tokenId: string = ''): string {
  // Relative URLs can be tested with the proper root URL:

  // Localhost without proxy, without phonebook:
  // http://{canister-id}.localhost:8080/
  // Localhost with proxy, without phonebook:
  // http://localhost:3000/-/{canister-id}/
  // Localhost with proxy, with phonebook:
  // http://localhost:3000/-/{collection-id}/

  // Mainnet without proxy, without phonebook (fully decentralized):
  // https://ap5ok-kqaaa-aaaak-acvha-cai.raw.ic0.app/
  // Mainnet with proxy, without phonebook:
  // https://prptl.io/-/{canister-id}/
  // Mainnet with proxy, with phonebook:
  // https://prptl.io/-/{collection-id}/

  if (tokenId) {
    // Example: https://ap5ok-kqaaa-aaaak-acvha-cai.raw.ic0.app/-/bm-1/-/brain.matters.nft1.html
    return `-/${tokenId}/-/${resourceName}`.toLowerCase();
  } else {
    // Example: https://ap5ok-kqaaa-aaaak-acvha-cai.raw.ic0.app/collection/-/ledger
    return `collection/-/${resourceName}`.toLowerCase();
  }
}

function buildFileMap(settings: ConfigSettings): FileInfoMap {
  // create mapping of local file names and their on-chain URLs
  const fileInfoMap: FileInfoMap = {};
  const collectionFiles = flattenFiles(settings.collectionFolder, settings.stageFolder);

  for (const filePath of collectionFiles) {
    const fileName = path.basename(filePath);
    const fileNameLower = fileName.toLowerCase();
    const fileNameWithoutExt = path.parse(fileNameLower).name;
    let libraryId = fileNameLower;

    let title = fileName;

    // dapps should not include the file extension in the url,
    // since the dapp menu in the UI shell currently has hard-coded names
    const relPath = path.relative(path.join(settings.stageFolder, 'collection'), filePath).toLowerCase();
    const dirName = path.dirname(relPath).toLocaleLowerCase();
    if (constants.DAAPS_FOLDER === dirName) {
      title = `${path.parse(fileName).name} dApp`;
      libraryId = fileNameWithoutExt;
    }

    const resourceUrl = `${getResourceUrl(libraryId)}`.toLowerCase();
    const relativeFilePath = path.relative(settings.stageFolder, filePath);
    const immutable = fileNameWithoutExt.endsWith('-immutable') || fileNameWithoutExt.endsWith('_immutable');

    fileInfoMap[relativeFilePath.toLowerCase()] = {
      title,
      libraryId,
      resourceUrl,
      filePath: relativeFilePath,
      immutable,
    };
  }

  let nftIndex = 1;
  for (let i = 1; i <= settings.nftDefinitionCount; i++) {
    // defaults to 1 NFT per NFT definition
    const nftQuantity = settings.nftQuantities?.[i - 1] || 1;

    const nftFolder = path.join(settings.stageFolder, constants.NFTS_FOLDER, `${i}`);

    for (let j = 0; j < nftQuantity; j++) {
      // ignore config file for collection references
      const nftFiles: string[] = flattenFiles(nftFolder, settings.stageFolder).filter(
        (f) => path.basename(f).toLowerCase() !== 'collection.json',
      );

      const tokenId = settings.tokenIds[nftIndex - 1];

      for (const filePath of nftFiles) {
        const fileName = path.basename(filePath);
        const fileNameLower = fileName.toLowerCase();
        const fileNameWithoutExt = path.parse(fileNameLower).name;
        let libraryId = fileNameLower;

        let title = fileName;

        // dapps should not include the file extension in the url,
        // since the dapp menu in the UI shell currently has hard-coded names
        const relPath = path.relative(path.join(settings.stageFolder, 'nfts', i.toString()), filePath).toLowerCase();
        const dirName = path.dirname(relPath).toLocaleLowerCase();
        if (constants.DAAPS_FOLDER === dirName) {
          title = `${path.parse(fileName).name} dApp`;
          libraryId = fileNameWithoutExt;
        }

        const resourceUrl = `${getResourceUrl(libraryId, tokenId)}`;
        const relativeFilePath = path.relative(settings.stageFolder, filePath);
        const immutable = fileNameWithoutExt.endsWith('-immutable') || fileNameWithoutExt.endsWith('_immutable');

        fileInfoMap[relativeFilePath.toLowerCase()] = {
          title,
          libraryId,
          resourceUrl,
          filePath: relativeFilePath,
          immutable,
        };
      }

      nftIndex++;
    }
  }

  return fileInfoMap;
}

function configureCollectionMetadata(settings: ConfigSettings): MetaWithLibrary {
  const resources: MetadataClass[] = [];
  const files = flattenFiles(constants.COLLECTION_FOLDER, settings.stageFolder);

  // map asset types to files that match the corresponding pattern
  const mappings = getAssetTypeMap(files, settings.assetTypeMapPatterns);

  // Iterate all html and css files and replace local paths with NFT URLs
  const filesWithUrls: string[] = files.filter((f) =>
    ['.html', '.htm', '.css', '.svg'].includes(path.extname(f).toLowerCase()),
  );

  // Ensure there are no external URL references (http/https)
  // validateNoExternalUrls(settings.stageFolder, filesWithUrls);

  for (const filePath of filesWithUrls) {
    replaceRelativeUrls(settings, filePath);
  }

  let sort = 1;
  for (const filePath of files) {
    const stats = fs.statSync(filePath);
    settings.totalFileSize += stats.size;

    resources.push(createClassForResource(settings, filePath, sort, stats.size));

    const library = createLibrary(settings, filePath);
    settings.collectionLibraries.push(library);
    sort++;
  }

  // Creates metadata representing a collection

  const attribs: PropertyShared[] = [];

  // The id for a collection is an empty string
  attribs.push(createTextAttrib('id', ''));
  attribs.push(createPrincipalAttrib('owner', settings.args.nftOwnerId || settings.args.creatorPrincipal));

  attribs.push(createPrincipalAttrib(`${constants.COM_ORIGYN_NS}.originator`, settings.args.originatorPrincipal));
  attribs.push(createPrincipalAttrib(`${constants.COM_ORIGYN_NS}.node`, settings.args.nodePrincipal));
  attribs.push(createPrincipalAttrib(`${constants.COM_ORIGYN_NS}.network`, settings.args.networkPrincipal));

  attribs.push(createRoyalties(settings));
  attribs.push(createRoyalties(settings, true));

  // assetType = 'primary_asset', 'preview_asset', 'experience_asset' or 'hidden_asset'
  Object.keys(mappings).forEach((assetType) => {
    attribs.push(createTextAttrib(`${assetType}_asset`, `${mappings[assetType]}`));
  });

  // attribs.push(
  //     createBoolAttrib('is_soulbound', settings.args.soulbound, false)
  // );

  // build classes that point to uploaded resources
  const resourceReferences = createClassesForResourceReferences(settings, resources, settings.collectionLibraries);

  attribs.push({
    name: 'library',
    value: {
      Array: [...resourceReferences],
    },
    immutable: false,
  });

  attribs.push(createAppsAttribute(settings));

  return {
    meta: {
      metadata: {
        Class: [...attribs],
      },
    },
    library: settings.collectionLibraries,
  };
}

// function validateNoExternalUrls(stageFolder: string, files: string[]) {
//   // Ensure there are no external URL references (http/https)
//   for (const filePath of files) {
//     const urls: string[] = getExternalUrls(path.resolve(stageFolder, filePath));

//     if (urls.length) {
//       log(`Found External URLs in file: "${filePath}"\n${JSON.stringify(urls, null, 2)}`);

//       throw (
//         '\nExternal URL references (http/https) must be replaced with local ' +
//         'relative file references so they can be uploaded to the NFT canister.\n'
//       );
//     }
//   }
// }

function configureNftsMetadata(settings: ConfigSettings): MetaWithLibrary[] {
  let nftIndex = 1;

  const nfts: MetaWithLibrary[] = [];

  for (let i = 1; i <= settings.nftDefinitionCount; i++) {
    // defaults to 1 NFT per NFT definition
    const nftQuantity = settings.nftQuantities?.[i - 1] || 1;

    log(`\nCreating metadata for ${nftQuantity} NFTs from NFT definition ${i}`);

    for (let j = 0; j < nftQuantity; j++) {
      const nftMetadata = configureNftMetadata(settings, nftIndex);
      nfts.push(nftMetadata);
      nftIndex++;
    }
  }

  return nfts;
}

function configureNftMetadata(settings: ConfigSettings, nftIndex: number): MetaWithLibrary {
  const resources: MetadataClass[] = [];
  const libraries: LibraryFile[] = [];

  const tokenId = settings.tokenIds[nftIndex - 1];
  const files = flattenFiles(path.join(constants.NFTS_FOLDER, nftIndex.toString()), settings.stageFolder);

  // get shared collection files listed in config file
  let collFiles: string[] = [];
  const pos = files.findIndex((f) => path.basename(f).toLowerCase() === 'collection.json');
  if (pos > -1) {
    collFiles = getCollectionReferences(files[pos]);
    files.splice(pos, 1);
  }

  // map asset types to files that match the corresponding pattern
  const assetTypeMap = getAssetTypeMap([...files, ...collFiles], settings.assetTypeMapPatterns);

  // Iterate all html and css files and replace local paths with NFT URLs
  const filesWithUrls = files.filter((f) => ['.html', '.htm', '.css', '.svg'].includes(path.extname(f).toLowerCase()));

  // Ensure there are no external URL references (http/https)
  // validateNoExternalUrls(settings.stageFolder, filesWithUrls);

  for (const filePath of filesWithUrls) {
    replaceRelativeUrls(settings, filePath);
  }

  let sort = 1;
  for (const filePath of files) {
    const stats = fs.statSync(filePath);
    settings.totalFileSize += stats.size;

    resources.push(createClassForResource(settings, filePath, sort, stats.size));

    const library = createLibrary(settings, filePath);
    libraries.push(library);

    sort++;
  }

  // handle shared collection level resource references
  // these are not added to the NFT metadata's library
  // so they are only staged/uploaded once to the collection
  for (const ref of collFiles) {
    const refFilePath = path.join(settings.collectionFolder, ref).toLowerCase();

    const refFileInfo = settings.fileMap[refFilePath];

    if (refFileInfo) {
      const refFileFullPath = path.resolve(settings.stageFolder, refFileInfo.filePath);

      const stats = fs.statSync(refFileFullPath);
      // note: do not add collection resources to totalFileSize
      resources.push(createClassForResource(settings, refFileFullPath, sort, stats.size));
      // note: do not add collection resources to NFT library

      sort++;
    }
  }

  // Creates metadata representing a single NFT

  const attribs: PropertyShared[] = [];

  attribs.push(createTextAttrib('id', tokenId));
  attribs.push(createPrincipalAttrib('owner', settings.args.nftOwnerId || settings.args.creatorPrincipal));

  // assetType = 'primary_asset', 'preview_asset', 'experience_asset' or 'hidden_asset'
  Object.keys(assetTypeMap).forEach((assetType) => {
    attribs.push(createTextAttrib(`${assetType}_asset`, `${assetTypeMap[assetType]}`));
  });

  attribs.push(createBoolAttrib('is_soulbound', settings.args.soulbound === 'true'));

  // build classes that point to uploaded resources
  const resourceRefs = createClassesForResourceReferences(settings, resources, libraries);

  attribs.push({
    name: 'library',
    value: {
      Array: [...resourceRefs],
    },
    immutable: false,
  });

  attribs.push(createAppsAttribute(settings, tokenId));

  return {
    meta: {
      metadata: {
        Class: [...attribs],
      },
    },
    library: libraries,
  };
}

function createRoyalties(settings: ConfigSettings, secondary: boolean = false): PropertyShared {
  const rates = secondary ? settings.royalties.rates.secondary : settings.royalties.rates.primary;

  const royalties = [
    {
      Class: [
        createTextAttrib('tag', `${constants.COM_ORIGYN_NS}.royalty.originator`),
        createFloatAttrib('rate', Number(rates.originator)),
      ],
    },
    {
      Class: [
        createTextAttrib('tag', `${constants.COM_ORIGYN_NS}.royalty.broker`),
        createFloatAttrib('rate', Number(rates.broker)),
      ],
    },
    {
      Class: [
        createTextAttrib('tag', `${constants.COM_ORIGYN_NS}.royalty.node`),
        createFloatAttrib('rate', Number(rates.node)),
      ],
    },
    {
      Class: [
        createTextAttrib('tag', `${constants.COM_ORIGYN_NS}.royalty.network`),
        createFloatAttrib('rate', Number(rates.network)),
      ],
    },
  ];

  if (rates.custom) {
    rates.custom.forEach((customRate) => {
      royalties.push({
        Class: [
          createTextAttrib('tag', `${constants.COM_ORIGYN_NS}.royalty.${customRate.customName}`),
          createFloatAttrib('rate', Number(customRate.rate)),
          createPrincipalAttrib('account', customRate.principalId),
        ],
      });
    });
  }

  return {
    name: `${constants.COM_ORIGYN_NS}.royalties.${secondary ? 'secondary' : 'primary'}.default`,
    value: {
      Array: royalties,
    },
    immutable: false,
  };
}

function getCollectionReferences(filePath: string): string[] {
  const refs = JSON.parse(
    fs.readFileSync(filePath, {
      encoding: 'utf8',
      flag: 'r',
    }),
  );

  if (!Array.isArray(refs) || refs.length === 0) {
    const err = `Expected "${filePath}" to contain a JSON array of file paths starting at the root of the "collection" folder.`;
    throw new Error(err);
  }

  return refs;
}

function getAssetTypeMap(files: string[], assetTypeMapPatterns: AssetTypeMap): AssetTypeMap {
  const mappings: AssetTypeMap = {};

  Object.keys(assetTypeMapPatterns).forEach((assetType) => {
    const fileNameEscaped = utils.escapeRegex(assetTypeMapPatterns[assetType].replace('*', '∞').toLowerCase());

    const fileNameRegEx = fileNameEscaped.replace('∞', '.*');

    const matches = files.filter((f) => path.basename(f).match(new RegExp(fileNameRegEx, 'gi'))?.length);

    for (const filePath of matches) {
      mappings[assetType] = path.basename(filePath);
    }
  });

  return mappings;
}

function createClassForResource(
  settings: ConfigSettings,
  filePath: string,
  sort: number,
  fileSize: number,
): MetadataClass {
  // ensure there are no duplicate file names in folder heirarchy
  const fileNameLower = path.basename(filePath).toLowerCase();

  // ensure the file has a valid mime type
  const mimeType = lookup(fileNameLower);
  if (!mimeType) {
    const err = `Could not find mime type for file: ${filePath}`;
    log(err);
    throw new Error(err);
  }

  const relFilePathLower = path.relative(settings.stageFolder, filePath).toLowerCase();
  const fileInfo = settings.fileMap[relFilePathLower];

  const attribs = [
    createTextAttrib('library_id', fileInfo.libraryId),
    createTextAttrib('title', `${settings.args.displayName} ${fileNameLower}`),
    createTextAttrib('location_type', 'canister'),
    createTextAttrib('location', fileInfo.resourceUrl),
    createTextAttrib('content_type', mimeType),
    createTextAttrib('content_hash', utils.getFileHash(filePath)),
    createNatAttrib('size', BigInt(fileSize)),
    createNatAttrib('sort', BigInt(sort)),
    createTextAttrib('read', 'public'),
  ];

  if (fileInfo.immutable) {
    attribs.push(createBoolAttrib('com.origyn.immutable_library', true, true));
  }

  return { Class: attribs };
}

function createLibrary(settings: ConfigSettings, filePath: string): LibraryFile {
  const relPath = path.relative(settings.stageFolder, filePath).toLowerCase();

  return {
    library_id: settings.fileMap[relPath].libraryId,
    library_file: path.relative(settings.stageFolder, filePath),
  };
}

function createTextAttrib(name: string, value: string, immutable: boolean = false): PropertyShared {
  return {
    name,
    value: { Text: value },
    immutable,
  };
}

function createPrincipalAttrib(name: string, value: string, immutable: boolean = false): PropertyShared {
  return {
    name,
    value: { Principal: Principal.fromText(value) },
    immutable,
  };
}

function createBoolAttrib(name: string, value: boolean, immutable: boolean = false): PropertyShared {
  return {
    name,
    value: { Bool: value },
    immutable,
  };
}

function createNatAttrib(name: string, value: bigint, immutable: boolean = false): PropertyShared {
  return {
    name,
    value: { Nat: value },
    immutable,
  };
}

function createFloatAttrib(name: string, value: number, immutable: boolean = false): PropertyShared {
  return {
    name,
    value: { Float: value },
    immutable,
  };
}

function createAppsAttribute(settings: ConfigSettings, tokenId: string = ''): PropertyShared {
  const dataAttributes: any[] = [];

  // at the collection level, include the collection id (i.e. "bayc") which is used in the
  // perpetualOS URL and phonebook to lookup and map to the canister id
  if (tokenId === '') {
    dataAttributes.push({
      name: `collection_id`,
      value: { Text: settings.args.collectionId },
      immutable: false,
    });
  }

  dataAttributes.push({
    name: `display_name`,
    value: {
      // if tokenId is passed, the display name for the NFT is the tokenId by default
      // an empty tokenId means that we are building collection level metadata
      // so provide the collection display name
      Text: tokenId ?? settings.args.displayName,
    },
    immutable: false,
  });

  // default all NFTs to same description as the collection
  // this can be changed in a post-script script
  dataAttributes.push({
    name: `description`,
    value: {
      Text:
        settings.args.description ||
        `An NFT collection hosted at https://${settings.args.nftCanisterId}.raw.ic0.app/collection/-/marketplace`,
    },
    immutable: false,
  });

  if (tokenId === '' && settings.args.socials) {
    const formattedSocials = settings.socials.map((item) => {
      return {
        Class: [
          {
            name: 'type',
            value: {
              Text: item.name,
            },
            immutable: false,
          },
          {
            name: 'url',
            value: {
              Text: decodeURIComponent(item.url),
            },
            immutable: false,
          },
        ],
      };
    });
    dataAttributes.push({
      name: `social_links`,
      value: {
        Array: formattedSocials,
      },
      immutable: false,
    });
  }

  // provide empty array for custom properties
  dataAttributes.push({
    name: `custom_properties`,
    value: {
      Array: [],
    },
    immutable: false,
  });

  return {
    name: '__apps',
    value: {
      Array: [
        {
          Class: [
            {
              name: 'app_id',
              value: { Text: 'com.origyn.metadata.general' },
              immutable: false,
            },
            {
              name: 'read',
              value: { Text: 'public' },
              immutable: false,
            },
            {
              name: 'write',
              value: {
                Class: [
                  {
                    name: 'type',
                    value: { Text: 'allow' },
                    immutable: false,
                  },
                  {
                    name: 'list',
                    value: {
                      Array: [
                        {
                          Principal: Principal.fromText(settings.args.creatorPrincipal),
                        },
                      ],
                    },
                    immutable: false,
                  },
                ],
              },
              immutable: false,
            },
            {
              name: 'permissions',
              value: {
                Class: [
                  {
                    name: 'type',
                    value: { Text: 'allow' },
                    immutable: false,
                  },
                  {
                    name: 'list',
                    value: {
                      Array: [
                        {
                          Principal: Principal.fromText(settings.args.creatorPrincipal),
                        },
                      ],
                    },
                    immutable: false,
                  },
                ],
              },
              immutable: false,
            },
            {
              name: 'data',
              value: { Class: dataAttributes },
              immutable: false,
            },
          ],
        },
      ],
    },
    immutable: false,
  };
}

function createClassesForResourceReferences(
  settings: ConfigSettings,
  resourceClasses: MetadataClass[],
  libraries: LibraryFile[],
): MetadataClass[] {
  const resourceReferences: MetadataClass[] = [];

  for (const cls of resourceClasses) {
    const libraryIdProperty = cls.Class.find((a) => a.name === 'library_id');
    if (!libraryIdProperty) {
      continue;
    }

    const libraryId: string = (libraryIdProperty.value as TextValue).Text;

    let locationType: LocationType = 'canister';
    let library = libraries.find((l) => l.library_id === libraryId);
    if (!library) {
      library = settings.collectionLibraries.find((l) => l.library_id === libraryId);

      if (library) {
        locationType = 'collection';
      } else {
        const err = `Could not find libraryId ${libraryId} in NFT or collection libraries.`;
        throw new Error(err);
      }
    }

    const relFilePath = path
      .relative(settings.stageFolder, path.resolve(settings.stageFolder, library.library_file))
      .toLowerCase();

    const fileInfo = settings.fileMap[relFilePath];
    const title = fileInfo.title;
    const location = cls.Class.find((a) => a.name === 'location')?.value;
    const size = cls.Class.find((a) => a.name === 'size')?.value;
    const sort = cls.Class.find((a) => a.name === 'sort')?.value;
    const contentType = cls.Class.find((a) => a.name === 'content_type')?.value;
    const contentHash = cls.Class.find((a) => a.name === 'content_hash')?.value;
    const immutableLibrary = cls.Class.find((a) => a.name === 'com.origyn.immutable_library')?.value;

    if (!title || !location || !size || !sort || !contentType || !contentHash) {
      throw new Error('Unexpected missing properties of resource class.');
    }

    const attribs = [
      createTextAttrib('library_id', libraryId),
      createTextAttrib('title', title),
      createTextAttrib('location_type', locationType),
      createTextAttrib('location', (location as TextValue).Text),
      createTextAttrib('content_type', (contentType as TextValue).Text),
      createTextAttrib('content_hash', (contentHash as TextValue).Text),
      createNatAttrib('size', locationType === 'collection' ? 0n : (size as NatValue).Nat),
      createNatAttrib('sort', (sort as NatValue).Nat),
      createTextAttrib('read', 'public'),
    ];

    if (immutableLibrary && (immutableLibrary as BoolValue)?.Bool) {
      attribs.push(createBoolAttrib('com.origyn.immutable_library', true, true));
    }

    resourceReferences.push({ Class: attribs });
  }

  return resourceReferences;
}

function buildConfigFileData(
  settings: ConfigSettings,
  summary: ConfigSummary,
  collection: MetaWithLibrary,
  nfts: MetaWithLibrary[],
): ConfigFile {
  return {
    settings,
    summary,
    collection,
    nfts: [
      // Metadata for defining each NFT definition (may be minted multiple times)
      ...nfts,
    ],
  };
}

function replaceRelativeUrls(settings: ConfigSettings, filePath: string): void {
  log(`\n${constants.LINE_DIVIDER_SECTION}\n`);
  log(`Replacing relative URLs with NFT URLs in file:\n${filePath}`);

  let contents: string = fs.readFileSync(filePath).toString();
  const matches = findUrls(filePath, contents);

  log(`\nregex matches ${matches.length}\n`);
  log(JSON.stringify(matches, null, 2));

  if (matches.length === 0) {
    return;
  }

  const urls = matches.flatMap((m) => {
    const attribValue = m[2];

    // remove srcset units so that only url remains
    // <img srcset="image-480w.jpg 480w, image-800w.jpg 800w"
    //   sizes="(max-width: 600px) 480px, 800px"
    //   src="image-800w.jpg"
    //   alt="Your description" />
    const srcsetUrls = attribValue.split(',').map((v) => v.trim());
    if (srcsetUrls.length > 1) {
      for (let i = 0; i < srcsetUrls.length; i++) {
        const units = [...srcsetUrls[i].matchAll(constants.SRCSET_VALUE_UNIT_REGEX)];
        if (units.length > 0) {
          srcsetUrls[i] = srcsetUrls[i].substring(0, units[units.length - 1].index);
        }
      }

      // remove any query string and/or fragment
      const baseUrls = srcsetUrls.map((v) => v.split(/#|\?/)[0]).filter((v) => v.length > 0);
      return baseUrls;
    } else {
      const baseUrl = attribValue.split(/#|\?/)[0];
      return [baseUrl];
    }
  });

  // ignore all external URLs (starting with http or https)
  const relativeUrls = urls.filter(
    (url) => url.search(constants.HTTP_OR_HTTPS_REGEX) === -1 && url.search(constants.DATA_URL_REGEX) === -1,
  );

  // remove duplicates and sort by longest first
  // this prevents shorter strings from matching longer strings
  // for example: 0.html would replace 10.html if not sorted
  const uniqueRelUrls = Array.from(new Set(relativeUrls)).sort((a, b) => b.length - a.length);

  log(`\nuniqueRelUrls\n${JSON.stringify(uniqueRelUrls)}`);

  for (const relUrl of uniqueRelUrls) {
    // search file map for a file with the same relative path, then get the on-chain URL

    // digital certificate level
    const relFilePathLower = path
      .relative(settings.stageFolder, path.resolve(path.dirname(filePath), relUrl))
      .toLowerCase();

    // collection level
    const relCollFilePathLower = path
      .relative(settings.stageFolder, path.resolve(path.join(settings.stageFolder, settings.collectionFolder), relUrl))
      .toLowerCase();

    const mapping = settings.fileMap[relFilePathLower] || settings.fileMap[relCollFilePathLower];

    if (mapping) {
      const onChainUrl = mapping.resourceUrl;
      // includes the first quote of the attribute in the search/replace to ensure the URL is not part of the content
      // the second quote is left out because the attribute may have a query string or fragment that was removed above
      contents = (contents as any).replaceAll(`"${relUrl}`, `"/${onChainUrl}`);
      contents = (contents as any).replaceAll(`'${relUrl}`, `'/${onChainUrl}`);

      log(`\n*** REPLACED ${relUrl}`);
      log(`WITH ${onChainUrl}`);
    } else {
      log(`\n*** NOT REPLACED ${relUrl}`);
      log(
        `WARNING: Could not find file "${relFilePathLower}" or "${relCollFilePathLower}" referenced in ${filePath}\n`,
      );
    }

    fs.writeFileSync(filePath, contents, { flag: 'w' });
  }
}
