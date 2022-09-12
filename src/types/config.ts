import { LibraryFile, Meta } from './metadata';

export type ConfigArgs = {
  /** environment */
  environment: string;
  /** collection id */
  collectionId: string;
  /** display name of collection */
  collectionDisplayName: string;
  /** token prefix */
  tokenPrefix: string;
  /** id of canister */
  nftCanisterId: string;
  /** principal id of creator */
  creatorPrincipal: string;
  /** namespace for NFT resources */
  namespace: string;
  /** folder path */
  folderPath: string;
  /** mappings (string with comma delimited list of 'asset_type:file_name, ...') */
  assetMappings: string;

  //optional args, but will map to empty strings

  /** owner of NFTs (if empty, defaults to NFT canister id) */
  nftOwnerId: string;
  /** soulbound (if empty, default to 'false') */
  soulbound: string;
  /** quantity */
  nftQuantities: string;
};

export type ConfigSettings = {
  args: ConfigArgs;
  assetTypeMapPatterns: AssetTypeMap;
  stageFolder: string;
  collectionFolder: FolderInfo | undefined;
  nftsFolder: FolderInfo | undefined;
  nftFolders: FolderInfo[];
  nftDefinitionCount: number;
  nftQuantities: number[];
  totalNftCount: number;
  fileMap: FileInfoMap;
  collectionLibraries: LibraryFile[];
  totalFileSize: number;
};

export type FolderInfo = {
  name: string;
  path: string;
};

export type FileInfo = {
  title: string;
  libraryId: string;
  resourceUrl: string;
  filePath: string;
};

export type FileInfoMap = {
  [filePath: string]: FileInfo;
};

export type AssetTypeMap = {
  primary?: string;
  preview?: string;
  experience?: string;
  hidden?: string;
};

export type ConfigSummary = {
  totalFilesFound: number;
  totalFileSize: string;
  totalNftDefinitionCount: number;
  totalNftCount: number;
};

export type ConfigFile = {
  args: ConfigArgs;
  summary: ConfigSummary;
  collection: Meta;
  nfts: Meta[];
};
