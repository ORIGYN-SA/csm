import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import * as utils from '../utils';
import mime from 'mime-types';
import { AssetTypeMap, ConfigArgs, ConfigSummary, ConfigFile, ConfigSettings, FileInfoMap } from '../types/config';
import { LibraryFile, MetadataClass, MetadataProperty, Meta, TextValue, NatValue } from '../types/metadata';
import { parseAssetTypeMapPatterns } from './arg-parser';
import { getSubFolders, flattenFiles, copyFolder, findUrls, getExternalUrls } from '../utils';
import * as constants from '../constants';

export function config(args: ConfigArgs): string {
  // config object
  let settings = initConfigSettings(args) as any;
  const err = validateConfigSettings(settings);
  if (err) {
    throw `Invalid config settings: ${err}`;
  }

  console.log(constants.LINE_DIVIDER_SECTION);
  console.log('\nCreating metadata for the collection\n');
  const collectionMetadata = configureCollectionMetadata(settings);

  console.log(constants.LINE_DIVIDER_SECTION);
  console.log('\nCreating metadata for the NFTs\n');
  const nftsMetadata = configureNftsMetadata(settings);

  console.log(`\n${constants.LINE_DIVIDER_SECTION}\n`);

  settings.totalNftCount = settings.nftQuantities?.length ? settings.totalNftCount : settings.nftDefinitionCount;

  // build config summary
  const summary: ConfigSummary = {
    totalFilesFound: Object.keys(settings.fileMap).length,
    totalFileSize: `${settings.totalFileSize} (${utils.formatBytes(settings.totalFileSize)})`,
    totalNftDefinitionCount: settings.nftDefinitionCount,
    totalNftCount: settings.totalNftCount,
  };

  const outputFilePath = path.join(settings.stageFolder, constants.CONFIG_FILE_NAME);

  // output definition file
  console.log('Creating config file with metadata...');
  fse.ensureDirSync(path.dirname(outputFilePath));

  const configFileData = buildConfigFileData(settings, summary, collectionMetadata, nftsMetadata);
  fs.writeFileSync(outputFilePath, JSON.stringify(configFileData, null, 2));
  console.log('Config file with metadata created');

  console.log(`\n${constants.LINE_DIVIDER_SECTION}\n`);

  console.log('Config Summary:\n');
  console.log(`Total Files Found: ${summary.totalFilesFound}`);
  console.log(`Total File Size: ${summary.totalFileSize}`);
  console.log(`Total NFT Definition Count: ${summary.totalNftDefinitionCount}`);
  console.log(`Total NFT Count: ${summary.totalNftCount}`);
  console.log(`Metadata File: '${outputFilePath}'`);

  console.log('\nFinished (config subcommand)\n');
  console.log(`${constants.LINE_DIVIDER_SUBCOMMAND}\n`);

  return outputFilePath;
}

function initConfigSettings(args: ConfigArgs): ConfigSettings {
  const assetTypeMapPatterns = parseAssetTypeMapPatterns(args.assetMappings);

  let nftQuantities: number[] = [];
  if (args.nftQuantities) {
    nftQuantities = args.nftQuantities.split(',').map((q) => Number(q.trim()));
  }

  const stageFolder = path.join(args.folderPath, '..', constants.STAGE_FOLDER);
  copyFolder(args.folderPath, stageFolder);

  const subFolders = getSubFolders(stageFolder);
  let collectionFolder = subFolders.find((f) => path.basename(f).toLowerCase() === constants.COLLECTION_FOLDER) || '';

  let nftsFolder = subFolders.find((f) => path.basename(f).toLowerCase() === constants.NFTS_FOLDER) || '';
  let nftFolderNames: string[] = [];
  if (nftsFolder) {
    nftFolderNames = getSubFolders(nftsFolder)
      .map((f) => path.basename(f))
      .filter((n) => parseInt(n) !== NaN)
      .sort((a, b) => parseInt(a) - parseInt(b));
  }

  const nftDefinitionCount = nftFolderNames.length;
  let totalNftCount = 0;
  if (nftQuantities.length) {
    // get the total NFT count - needed in metadata of NFT
    for (let i = 0; i < nftDefinitionCount; i++) {
      // default to one if no quantities specified
      totalNftCount += nftQuantities[i] || 1;
    }
  }

  if (collectionFolder) {
    collectionFolder = path.relative(stageFolder, collectionFolder);
  }
  if (nftsFolder) {
    nftsFolder = path.relative(stageFolder, nftsFolder);
  }

  const settings: ConfigSettings = {
    args,
    assetTypeMapPatterns,
    stageFolder,
    collectionFolder,
    nftsFolder,
    nftFolderNames,
    nftDefinitionCount,
    nftQuantities,
    totalNftCount,
    fileMap: {},
    collectionLibraries: [],
    totalFileSize: 0,
  };

  // build collection (resource library) metadata objects for all files
  // all files need to be uploaded to the canister
  settings.fileMap = buildFileMap(settings);

  return settings;
}

function validateConfigSettings(settings: ConfigSettings): string {
  if (!settings.collectionFolder) {
    return `\nExpected to find a '${constants.COLLECTION_FOLDER}' folder at ${path.relative(
      settings.stageFolder,
      path.join(settings.args.folderPath, constants.COLLECTION_FOLDER),
    )}\n`;
  }

  if (!settings.nftsFolder) {
    return `\nExpected to find an '${constants.NFTS_FOLDER}' folder at ${path.relative(
      settings.stageFolder,
      path.join(settings.args.folderPath, constants.NFTS_FOLDER),
    )}\n`;
  }

  for (let i = 0; i < settings.nftDefinitionCount; i++) {
    if (i !== parseInt(settings.nftFolderNames[i])) {
      return `The ${constants.NFTS_FOLDER} folder's subfolders must be numbered in sequence starting at 0. Missing folder ${i}.'`;
    }
  }

  if (settings.nftDefinitionCount === 0) {
    return `No NFT definitions found. Please create a folder under the '${constants.NFTS_FOLDER}' folder for each NFT definition and name it with the index of the NFT starting with 0.`;
  }

  if (settings.nftQuantities?.length && settings.nftDefinitionCount != settings.nftQuantities.length) {
    return `\nError: Count mismatch: ${settings.nftDefinitionCount} NFT folders and ${settings.nftQuantities.length} quantities (-q arg).\n`;
  }

  return '';
}

function getResourceUrl(settings: ConfigSettings, resourceName: string, tokenId: string = ''): string {
  let rootUrl = '';
  switch ((settings.args.environment || '').toLowerCase()) {
    case 'l':
    case 'local':
    case 'localhost':
      rootUrl = `http://${settings.args.nftCanisterId}.localhost:8000`;
      break;
    case 'p':
    case 'prod':
    case 'production':
      rootUrl = `https://exos.origyn.network/-/${settings.args.collectionId}`;
      break;
    default: // dev, stage, etc.
      rootUrl = `https://exos.origyn.network/-/${settings.args.nftCanisterId}`;
      break;
  }

  if (tokenId) {
    // https://rrkah-fqaaa-aaaaa-aaaaq-cai.raw.ic0.app/-/bayc-01/-/com.bayc.ape.0.primary
    return `${rootUrl}/-/${tokenId}/-/${resourceName}`.toLowerCase();
  } else {
    // https://frfol-iqaaa-aaaaj-acogq-cai.raw.ic0.app/collection/-/ledger
    return `${rootUrl}/collection/-/${resourceName}`.toLowerCase();
  }
}

function buildFileMap(settings: ConfigSettings): FileInfoMap {
  // create mapping of local file names and their on-chain URLs
  const fileInfoMap: FileInfoMap = {};
  const collectionFiles = flattenFiles(settings.collectionFolder, settings.stageFolder);

  for (const filePath of collectionFiles) {
    let libraryId = `${settings.args.namespace}.${path.basename(filePath)}`.toLowerCase();

    let title = path.basename(filePath);

    // dapps should not include the namespace or file extension in the url,
    // since the dapp menu in the UI shell currently has hard-coded names
    const relPath = path.relative(path.join(settings.stageFolder, 'collection'), filePath).toLowerCase();
    const dirName = path.dirname(relPath).toLocaleLowerCase();
    if (constants.DAAPS_FOLDER === dirName) {
      libraryId = path.basename(filePath).toLowerCase();
      const extPos = libraryId.lastIndexOf('.');
      if (extPos > 0) {
        libraryId = libraryId.substring(0, extPos);
      }

      title = `${libraryId} dApp`;
    }

    const resourceUrl = `${getResourceUrl(settings, libraryId)}`.toLowerCase();
    const relativeFilePath = path.relative(settings.stageFolder, filePath);

    fileInfoMap[relativeFilePath.toLowerCase()] = {
      title,
      libraryId,
      resourceUrl,
      filePath: relativeFilePath,
    };
  }

  let nftIndex = 0;
  for (let i = 0; i < settings.nftDefinitionCount; i++) {
    // defaults to 1 NFT per NFT definition
    const nftQuantity = settings.nftQuantities?.[i] || 1;

    const nftFolder = path.join(settings.stageFolder, constants.NFTS_FOLDER, `${i}`);

    for (let j = 0; j < nftQuantity; j++) {
      // ignore config file for collection references
      const nftFiles: string[] = flattenFiles(nftFolder, settings.stageFolder).filter(
        (f) => path.basename(f).toLowerCase() !== 'collection.json',
      );

      const assetTypeMap = getAssetTypeMap(nftFiles, settings.assetTypeMapPatterns);

      const tokenId = `${settings.args.tokenPrefix}${nftIndex}`.toLowerCase();

      for (const filePath of nftFiles) {
        const libraryId = `${settings.args.namespace}.${path.basename(filePath)}`.toLowerCase();

        const resourceUrl = `${getResourceUrl(settings, libraryId, tokenId)}`;

        // find the asset type of this file (primary, preview, experience, hidden)
        let nftAssetType = '';
        for (let assetType in assetTypeMap) {
          if (assetTypeMap[assetType].toLowerCase() === path.basename(filePath).toLowerCase()) {
            nftAssetType = assetType === 'primary' ? '' : ` ${assetType}`;
            break;
          }
        }

        const title = `${settings.args.collectionDisplayName} - ${nftIndex}${nftAssetType}`;
        const relativeFilePath = path.relative(settings.stageFolder, filePath);

        fileInfoMap[relativeFilePath.toLowerCase()] = {
          title,
          libraryId,
          resourceUrl,
          filePath: relativeFilePath,
        };
      }

      nftIndex++;
    }
  }

  return fileInfoMap;
}

function configureCollectionMetadata(settings: ConfigSettings): Meta {
  const resources: MetadataClass[] = [];
  const files = flattenFiles(constants.COLLECTION_FOLDER, settings.stageFolder);

  // map asset types to files that match the corresponding pattern
  const mappings = getAssetTypeMap(files, settings.assetTypeMapPatterns);

  // Iterate all html and css files and replace local paths with NFT URLs
  const filesWithUrls: string[] = files.filter((f) =>
    ['.html', '.htm', '.css'].includes(path.extname(f).toLowerCase()),
  );

  // Ensure there are no external URL references (http/https)
  for (const filePath of filesWithUrls) {
    const urls: string[] = getExternalUrls(path.resolve(settings.stageFolder, filePath));

    if (urls.length) {
      console.log(`Found External URLs in file: "${filePath}"`, JSON.stringify(urls, null, 2));

      throw (
        '\nExternal URL references (http/https) must be replaced with local ' +
        'relative file references so they can be uploaded to the NFT canister.\n'
      );
    }
  }

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

  const properties: MetadataProperty[] = [];
  const immutable = true;

  // The id for a collection is an empty string
  properties.push(createTextAttrib('id', '', immutable));

  // assetType = 'primary_asset', 'preview_asset', 'experience_asset' or 'hidden_asset'
  for (let assetType in mappings) {
    properties.push(
      createTextAttrib(
        `${settings.args.namespace}.${assetType}`,
        `${settings.args.namespace}.${mappings[assetType]}`,
        immutable,
      ),
    );
  }

  properties.push(createTextAttrib('owner', settings.args.nftOwnerId || settings.args.nftCanisterId, !immutable));
  // attribs.push(
  //     createBoolAttrib('is_soulbound', settings.args.soulbound, !immutable)
  // );

  // build classes that point to uploaded resources
  const resourceReferences = createClassesForResourceReferences(settings, resources, settings.collectionLibraries);

  properties.push({
    name: 'library',
    value: {
      Array: { thawed: [...resourceReferences] },
    },
    immutable: true,
  });

  const appsAttribute = createAppsAttribute(settings);

  properties.push(appsAttribute);

  return {
    meta: {
      metadata: {
        Class: [...properties],
      },
    },
    library: settings.collectionLibraries,
  };
}

function configureNftsMetadata(settings: ConfigSettings): Meta[] {
  let nftIndex = 0;
  let nfts: Meta[] = [];

  for (let i = 0; i < settings.nftDefinitionCount; i++) {
    // defaults to 1 NFT per NFT definition
    const nftQuantity = settings.nftQuantities?.[i] || 1;

    console.log(`\nCreating metadata for ${nftQuantity} NFTs from NFT definition ${i}`);

    for (let j = 0; j < nftQuantity; j++) {
      const nftMetadata = configureNftMetadata(settings, nftIndex);
      nfts.push(nftMetadata);
      nftIndex++;
    }
  }

  return nfts;
}

function configureNftMetadata(settings: ConfigSettings, nftIndex: number): Meta {
  const resources: MetadataClass[] = [];
  const libraries: LibraryFile[] = [];

  const tokenId = `${settings.args.tokenPrefix}${nftIndex}`;
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
  const filesWithUrls = files.filter((f) => ['.html', '.htm', '.css'].includes(path.extname(f).toLowerCase()));

  // Ensure there are no external URL references (http/https)
  for (const filePath of filesWithUrls) {
    const urls: string[] = getExternalUrls(filePath);

    if (urls.length) {
      console.log(`Found External URLs in file: "${filePath}"`, JSON.stringify(urls, null, 2));

      throw (
        '\nExternal URL references (http/https) must be replaced with local ' +
        'relative file references so they can be uploaded to the NFT canister.\n'
      );
    }
  }

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

    const refFileFullPath = path.resolve(settings.stageFolder, refFileInfo.filePath);

    const stats = fs.statSync(refFileFullPath);
    // note: do not add collection resources to totalFileSize
    resources.push(createClassForResource(settings, refFileFullPath, sort, stats.size));
    // note: do not add collection resources to NFT library

    sort++;
  }

  // Creates metadata representing a single NFT

  const properties: MetadataProperty[] = [];
  const immutable = true;

  properties.push(createTextAttrib('id', tokenId, immutable));

  // assetType = 'primary_asset', 'preview_asset', 'experience_asset' or 'hidden_asset'
  for (let assetType in assetTypeMap) {
    properties.push(
      createTextAttrib(`${assetType}_asset`, `${settings.args.namespace}.${assetTypeMap[assetType]}`, immutable),
    );
  }

  properties.push(createTextAttrib('owner', settings.args.nftOwnerId || settings.args.nftCanisterId, !immutable));
  properties.push(createBoolAttrib('is_soulbound', settings.args.soulbound === 'true', !immutable));

  // build classes that point to uploaded resources
  const resourceRefs = createClassesForResourceReferences(settings, resources, libraries);

  properties.push({
    name: 'library',
    value: {
      Array: { thawed: [...resourceRefs] },
    },
    immutable: true,
  });

  const appsAttribute = createAppsAttribute(settings);

  properties.push(appsAttribute);

  return {
    meta: {
      metadata: {
        Class: [...properties],
      },
    },
    library: libraries,
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
    throw err;
  }

  return refs;
}

function getAssetTypeMap(files: string[], assetTypeMapPatterns: AssetTypeMap): AssetTypeMap {
  const mappings: AssetTypeMap = {};

  for (const assetType in assetTypeMapPatterns) {
    const fileNameEscaped = utils.escapeRegex(assetTypeMapPatterns[assetType].replace('*', '∞').toLowerCase());

    const fileNameRegEx = fileNameEscaped.replace('∞', '.*');

    const matches = files.filter((f) => path.basename(f).match(new RegExp(fileNameRegEx, 'gi'))?.length);

    for (let filePath of matches) {
      mappings[assetType] = path.basename(filePath);
    }
  }

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
  const mimeType = mime.lookup(fileNameLower);
  if (!mimeType) {
    const err = `Could not find mime type for file: ${filePath}`;
    console.log(err);
    throw err;
  }

  const relFilePathLower = path.relative(settings.stageFolder, filePath).toLowerCase();

  return {
    Class: [
      createTextAttrib('library_id', settings.fileMap[relFilePathLower].libraryId, constants.IMMUTABLE),
      createTextAttrib('title', `${settings.args.collectionDisplayName} ${fileNameLower}`, constants.IMMUTABLE),
      createTextAttrib('location_type', 'canister', constants.IMMUTABLE),
      createTextAttrib('location', settings.fileMap[relFilePathLower].resourceUrl, constants.IMMUTABLE),
      createTextAttrib('content_type', mimeType, constants.IMMUTABLE),
      createTextAttrib('content_hash', utils.getFileHash(filePath), constants.IMMUTABLE),
      createNatAttrib('size', fileSize, constants.IMMUTABLE),
      createNatAttrib('sort', sort, constants.IMMUTABLE),
      createTextAttrib('read', 'public', !constants.IMMUTABLE),
    ],
  };
}

function createLibrary(settings: ConfigSettings, filePath: string): LibraryFile {
  const relPath = path.relative(settings.stageFolder, filePath).toLowerCase();

  return {
    library_id: settings.fileMap[relPath].libraryId,
    library_file: path.relative(settings.stageFolder, filePath),
  };
}

function createTextAttrib(name: string, value: string, immutable: boolean): MetadataProperty {
  return {
    name,
    value: { Text: value },
    immutable,
  };
}

function createBoolAttrib(name: string, value: boolean, immutable: boolean): MetadataProperty {
  return {
    name,
    value: { Bool: value },
    immutable,
  };
}

function createNatAttrib(name: string, value: number, immutable: boolean): MetadataProperty {
  return {
    name,
    value: { Nat: value },
    immutable,
  };
}

function createAppsAttribute(settings: ConfigSettings): MetadataProperty {
  return {
    name: '__apps',
    value: {
      Array: {
        thawed: [
          {
            Class: [
              {
                name: 'app_id',
                value: { Text: settings.args.namespace },
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
                        Array: {
                          thawed: [
                            {
                              Principal: settings.args.creatorPrincipal,
                            },
                          ],
                        },
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
                        Array: {
                          thawed: [
                            {
                              Principal: settings.args.creatorPrincipal,
                            },
                          ],
                        },
                      },
                      immutable: false,
                    },
                  ],
                },
                immutable: false,
              },
              {
                name: 'data',
                value: {
                  Class: [
                    {
                      name: `${settings.args.namespace}.name`,
                      value: {
                        Text: settings.args.collectionDisplayName,
                      },
                      immutable: false,
                    },
                    {
                      name: `${settings.args.namespace}.total_in_collection`,
                      value: { Nat: settings.totalNftCount },
                      immutable: false,
                    },
                    {
                      name: `${settings.args.namespace}.collectionid`,
                      value: {
                        Text: settings.args.collectionId,
                      },
                      immutable: false,
                    },
                    {
                      name: `${settings.args.namespace}.creator_principal`,
                      value: {
                        Principal: settings.args.creatorPrincipal,
                      },
                      immutable: false,
                    },
                  ],
                },
                immutable: false,
              },
            ],
          },
        ],
      },
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

  for (let cls of resourceClasses) {
    const libraryIdProperty = cls.Class.find((a) => a.name === 'library_id');
    if (!libraryIdProperty) {
      continue;
    }

    const libraryId: string = (libraryIdProperty.value as TextValue).Text;

    let locationType = 'canister';
    let library = libraries.find((l) => l.library_id === libraryId);
    if (!library) {
      library = settings.collectionLibraries.find((l) => l.library_id === libraryId);

      if (library) {
        locationType = 'collection';
      } else {
        const err = `Could not find libraryId ${libraryId} in NFT or collection libraries.`;
        throw err;
      }
    }

    const relFilePath = path
      .relative(settings.stageFolder, path.resolve(settings.stageFolder, library.library_file))
      .toLowerCase();

    const title = settings.fileMap[relFilePath]?.title;
    const location = cls.Class.find((a) => a.name === 'location')?.value;
    const size = cls.Class.find((a) => a.name === 'size')?.value;
    const sort = cls.Class.find((a) => a.name === 'sort')?.value;
    const contentType = cls.Class.find((a) => a.name === 'content_type')?.value;
    const contentHash = cls.Class.find((a) => a.name === 'content_hash')?.value;

    if (!title || !location || !size || !sort || !contentType || !contentHash) {
      throw 'Unexpected missing properties of resource class.';
    }

    resourceReferences.push({
      Class: [
        createTextAttrib('library_id', libraryId, constants.IMMUTABLE),
        createTextAttrib('title', title, constants.IMMUTABLE),
        createTextAttrib('location_type', locationType, constants.IMMUTABLE),
        createTextAttrib('location', (location as TextValue).Text, constants.IMMUTABLE),
        createTextAttrib('content_type', (contentType as TextValue).Text, constants.IMMUTABLE),
        createTextAttrib('content_hash', (contentHash as TextValue).Text, constants.IMMUTABLE),
        createNatAttrib('size', (size as NatValue).Nat, constants.IMMUTABLE),
        createNatAttrib('sort', (sort as NatValue).Nat, constants.IMMUTABLE),
        createTextAttrib('read', 'public', !constants.IMMUTABLE),
      ],
    });
  }

  return resourceReferences;
}

function buildConfigFileData(
  settings: ConfigSettings,
  summary: ConfigSummary,
  collection: Meta,
  nfts: Meta[],
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
  console.log(`\n${constants.LINE_DIVIDER_SECTION}\n`);
  console.log('Replacing relative URLs with NFT URLs in file:\n', filePath);

  let contents: string = fs.readFileSync(filePath).toString();
  const matches = findUrls(filePath, contents);

  console.log(`\nregex matches ${matches.length}\n`);
  console.log(JSON.stringify(matches, null, 2));

  if (matches.length === 0) {
    return;
  }

  let urls = matches
    .flatMap((m) => {
      const urls = m[1].split(',').map((v) => v.trim());

      // check if srcset value with units like 200w or 1.5x
      // and remove units so that only url remains
      for (let i = 0; i < urls.length; i++) {
        let srcsetUnitMatches = [...urls[i].matchAll(constants.SRCSET_VALUE_UNIT_REGEX)];
        if (srcsetUnitMatches.length > 0) {
          urls[i] = urls[i].substring(0, srcsetUnitMatches[srcsetUnitMatches.length - 1].index);
        }
      }

      return urls;
    })
    .filter((m) => m.indexOf('#') !== 0);

  const relativeUrls = urls.filter(
    (url) => url.search(constants.HTTP_OR_HTTPS_REGEX) === -1 && url.search(constants.DATA_URL_REGEX) === -1,
  );

  // get array of unique urls sorted by longest first
  // this prevents shorter strings from matching longer strings
  // for example: 0.html would replace 10.html if not sorted
  const uniqueRelUrls = Array.from(new Set(relativeUrls)).sort((a, b) => b.length - a.length);

  console.log('\nuniqueRelUrls', uniqueRelUrls);

  for (const relUrl of uniqueRelUrls) {
    let relFilePathLower = path
      .relative(settings.stageFolder, path.resolve(path.dirname(filePath), relUrl))
      .toLowerCase();

    if (settings.fileMap[relFilePathLower]) {
      const resourceUrl = settings.fileMap[relFilePathLower].resourceUrl;
      contents = (contents as any).replaceAll(`"${relUrl}"`, `"${resourceUrl}"`);
      contents = (contents as any).replaceAll(`'${relUrl}'`, `'${resourceUrl}'`);

      console.log(`\n*** REPLACED ${relUrl}`);
      console.log(`WITH ${resourceUrl}`);
    } else {
      relFilePathLower = path
        .relative(settings.stageFolder, path.resolve(settings.collectionFolder, relUrl))
        .toLowerCase();

      if (settings.fileMap[relFilePathLower]) {
        const resourceUrl = settings.fileMap[relFilePathLower].resourceUrl;
        contents = (contents as any).replaceAll(`"${relUrl}"`, `"${resourceUrl}"`);
        contents = (contents as any).replaceAll(`'${relUrl}'`, `'${resourceUrl}'`);

        console.log(`\n*** REPLACED ${relUrl}`);
        console.log(`WITH ${resourceUrl}`);
      } else {
        const err = `Could not find file ${relFilePathLower} referenced in ${filePath}`;
        throw err;
      }
    }
  }

  fs.writeFileSync(filePath, contents, { flag: 'w' });
}
