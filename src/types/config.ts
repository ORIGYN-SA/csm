import type { LibraryFile, MetaWithLibrary } from './metadata.js';

export interface ConfigArgs {
  collectionId: string;
  collectionName: string;
  collectionSymbol: string;
  collectionLogoPath: string;
  description: string;
  nftCanisterId: string;
  creatorPrincipal: string;
  folderPath: string;

  // string with comma delimited list of 'asset_type:file_name, ...'
  // supports the * wildcard character
  // example: 'primary:nft*.png,experience:index.html,hidden:hidden.jpg'
  assetMappings: string;

  // optional args, but will map to empty strings

  // if empty, defaults to NFT canister id
  nftOwnerId: string;
  // if empty, defaults to 'false'
  soulbound: string;
  // string with comma delimited list of 'nft_def_number:quantity, ...'
  // example: '0:3,1:3,2:5,3:10'
  // if empty, defaults to 1 NFT per NFT definition
  nftQuantities: string;
  // string with a comma delimited list of social urls for the collection
  // urls must be encoded and not include chars such as ':'
  // example: 'twitter:https%3A%2F%2Ftwitter.com%2FYumiMarketplace, dscvr:https%3A%2F%2Fh5aet-waaaa-aaaab-qaamq-cai.raw.ic0.app%2Fu%2Fyumi_marketplace'
  socials: string;

  // royalties
  nodePrincipal: string;
  originatorPrincipal: string;
  networkPrincipal: string;
  primaryBrokerRate: string;
  primaryNodeRate: string;
  primaryOriginatorRate: string;
  primaryNetworkRate: string;
  secondaryBrokerRate: string;
  secondaryNodeRate: string;
  secondaryOriginatorRate: string;
  secondaryNetworkRate: string;
  primaryCustomRates: string;
  secondaryCustomRates: string;
}

export interface ConfigSettings {
  args: ConfigArgs;
  assetTypeMapPatterns: AssetTypeMap;
  stageFolder: string;
  collectionFolder: string;
  nftsFolder: string;
  tokenIds: string[];
  nftDefinitionCount: number;
  nftQuantities: number[];
  socials: Social[];
  totalNftCount: number;
  fileMap: FileInfoMap;
  collectionLibraries: LibraryFile[];
  totalFileSize: number;
  royalties: Royalties;
}

export interface FileInfo {
  title: string;
  libraryId: string;
  resourceUrl: string;
  filePath: string;
  immutable?: boolean;
}

// equivalent to: [filePath: string]: FileInfo;
export interface FileInfoMap extends Record<string, FileInfo> {}

export interface AssetTypeMap {
  primary?: string;
  preview?: string;
  experience?: string;
  hidden?: string;
}

export interface ConfigSummary {
  totalFilesFound: number;
  totalFileSize: string;
  totalNftDefinitionCount: number;
  totalNftCount: number;
}

export interface ConfigFile {
  settings: ConfigSettings;
  summary: ConfigSummary;
  collection: MetaWithLibrary;
  nfts: MetaWithLibrary[];
}

export interface CustomRoyaltyRate {
  customName: string;
  principalId: string;
  rate: string;
}

export interface RoyaltyPayees {
  originator: string;
  node: string;
  network: string;
}

export interface RoyaltyRates {
  originator: string;
  broker: string;
  node: string;
  network: string;
  custom: CustomRoyaltyRate[];
}

export interface Royalties {
  payees: RoyaltyPayees;
  rates: {
    primary: RoyaltyRates;
    secondary: RoyaltyRates;
  };
}

export interface Social {
  name: string;
  url: string;
}
