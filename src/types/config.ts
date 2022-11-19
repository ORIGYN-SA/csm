import { LibraryFile, Meta } from './metadata';

export type ConfigArgs = {
  collectionId: string;
  collectionDisplayName: string;
  tokenPrefix: string;
  tokenWords: string;
  minWords: string;
  maxWords: string;
  nftCanisterId: string;
  creatorPrincipal: string;
  namespace: string;
  folderPath: string;

  // string with comma delimited list of 'asset_type:file_name, ...'
  // supports the * wildcard character
  // example: 'primary:nft*.png,experience:index.html,hidden:hidden.jpg'
  assetMappings: string;

  //optional args, but will map to empty strings

  // if empty, defaults to NFT canister id
  nftOwnerId: string;
  // if empty, defaults to 'false'
  soulbound: string;
  // string with comma delimited list of 'nft_def_number:quantity, ...'
  // example: '0:3,1:3,2:5,3:10'
  // if empty, defaults to 1 NFT per NFT definition
  nftQuantities: string;

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
};

export type ConfigSettings = {
  args: ConfigArgs;
  assetTypeMapPatterns: AssetTypeMap;
  stageFolder: string;
  collectionFolder: string;
  nftsFolder: string;
  tokenIds: string[];
  nftDefinitionCount: number;
  nftQuantities: number[];
  totalNftCount: number;
  fileMap: FileInfoMap;
  collectionLibraries: LibraryFile[];
  totalFileSize: number;
  royalties: Royalties;
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
  settings: ConfigSettings;
  summary: ConfigSummary;
  collection: Meta;
  nfts: Meta[];
};

export type CustomRoyaltyRate = {
  customName: string;
  principalId: string;
  rate: string
}

export type RoyaltyPayees = {
  originator: string;
  node: string;
  network: string;
};

export type RoyaltyRates = {
  originator: string;
  broker: string;
  node: string;
  network: string;
  custom: CustomRoyaltyRate[]
};

export type Royalties = {
  payees: RoyaltyPayees,
  rates: {
    primary: RoyaltyRates,
    secondary: RoyaltyRates
  }
}
