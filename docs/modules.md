[@origyn-sa/csm](README.md) / Exports

# @origyn-sa/csm

## Table of contents

### Type Aliases

- [AssetTypeMap](modules.md#assettypemap)
- [BoolValue](modules.md#boolvalue)
- [ConfigArgs](modules.md#configargs)
- [ConfigFile](modules.md#configfile)
- [ConfigSettings](modules.md#configsettings)
- [ConfigSummary](modules.md#configsummary)
- [FileInfo](modules.md#fileinfo)
- [FileInfoMap](modules.md#fileinfomap)
- [LibraryFile](modules.md#libraryfile)
- [Meta](modules.md#meta)
- [MetadataClass](modules.md#metadataclass)
- [MetadataProperty](modules.md#metadataproperty)
- [NatValue](modules.md#natvalue)
- [PrincipalValue](modules.md#principalvalue)
- [TextValue](modules.md#textvalue)
- [ThawedArrayValue](modules.md#thawedarrayvalue)

### Functions

- [config](modules.md#config)
- [parseConfigArgs](modules.md#parseconfigargs)

## Type Aliases

### AssetTypeMap

Ƭ **AssetTypeMap**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `experience?` | `string` |
| `hidden?` | `string` |
| `preview?` | `string` |
| `primary?` | `string` |

#### Defined in

[types/config.ts:59](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/config.ts#L59)

___

### BoolValue

Ƭ **BoolValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Bool` | `boolean` |

#### Defined in

[types/metadata.ts:16](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/metadata.ts#L16)

___

### ConfigArgs

Ƭ **ConfigArgs**: `Object`

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `assetMappings` | `string` | mappings (string with comma delimited list of 'asset_type:file_name, ...') |
| `collectionDisplayName` | `string` | display name of collection |
| `collectionId` | `string` | collection id |
| `creatorPrincipal` | `string` | principal id of creator |
| `environment` | `string` | environment |
| `folderPath` | `string` | folder path |
| `namespace` | `string` | namespace for NFT resources |
| `nftCanisterId` | `string` | id of canister |
| `nftOwnerId` | `string` | owner of NFTs (if empty, defaults to NFT canister id) |
| `nftQuantities` | `string` | quantity |
| `soulbound` | `string` | soulbound (if empty, default to 'false') |
| `tokenPrefix` | `string` | token prefix |

#### Defined in

[types/config.ts:3](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/config.ts#L3)

___

### ConfigFile

Ƭ **ConfigFile**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `args` | [`ConfigArgs`](modules.md#configargs) |
| `collection` | [`Meta`](modules.md#meta) |
| `nfts` | [`Meta`](modules.md#meta)[] |
| `summary` | [`ConfigSummary`](modules.md#configsummary) |

#### Defined in

[types/config.ts:73](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/config.ts#L73)

___

### ConfigSettings

Ƭ **ConfigSettings**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `args` | [`ConfigArgs`](modules.md#configargs) |
| `assetTypeMapPatterns` | [`AssetTypeMap`](modules.md#assettypemap) |
| `collectionFolder` | `string` |
| `collectionLibraries` | [`LibraryFile`](modules.md#libraryfile)[] |
| `fileMap` | [`FileInfoMap`](modules.md#fileinfomap) |
| `nftDefinitionCount` | `number` |
| `nftFolderNames` | `string`[] |
| `nftQuantities` | `number`[] |
| `nftsFolder` | `string` |
| `stageFolder` | `string` |
| `totalFileSize` | `number` |
| `totalNftCount` | `number` |

#### Defined in

[types/config.ts:33](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/config.ts#L33)

___

### ConfigSummary

Ƭ **ConfigSummary**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `totalFileSize` | `string` |
| `totalFilesFound` | `number` |
| `totalNftCount` | `number` |
| `totalNftDefinitionCount` | `number` |

#### Defined in

[types/config.ts:66](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/config.ts#L66)

___

### FileInfo

Ƭ **FileInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `libraryId` | `string` |
| `resourceUrl` | `string` |
| `title` | `string` |

#### Defined in

[types/config.ts:48](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/config.ts#L48)

___

### FileInfoMap

Ƭ **FileInfoMap**: `Object`

#### Index signature

▪ [filePath: `string`]: [`FileInfo`](modules.md#fileinfo)

#### Defined in

[types/config.ts:55](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/config.ts#L55)

___

### LibraryFile

Ƭ **LibraryFile**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `library_file` | `string` |
| `library_id` | `string` |

#### Defined in

[types/metadata.ts:3](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/metadata.ts#L3)

___

### Meta

Ƭ **Meta**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `library` | [`LibraryFile`](modules.md#libraryfile)[] |
| `meta` | { `metadata`: [`MetadataClass`](modules.md#metadataclass)  } |
| `meta.metadata` | [`MetadataClass`](modules.md#metadataclass) |

#### Defined in

[types/metadata.ts:38](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/metadata.ts#L38)

___

### MetadataClass

Ƭ **MetadataClass**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Class` | [`MetadataProperty`](modules.md#metadataproperty)[] |

#### Defined in

[types/metadata.ts:34](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/metadata.ts#L34)

___

### MetadataProperty

Ƭ **MetadataProperty**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `immutable` | `boolean` |
| `name` | `string` |
| `value` | [`TextValue`](modules.md#textvalue) \| [`NatValue`](modules.md#natvalue) \| [`BoolValue`](modules.md#boolvalue) \| [`PrincipalValue`](modules.md#principalvalue) \| [`ThawedArrayValue`](modules.md#thawedarrayvalue) \| [`MetadataClass`](modules.md#metadataclass) |

#### Defined in

[types/metadata.ts:28](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/metadata.ts#L28)

___

### NatValue

Ƭ **NatValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Nat` | `number` |

#### Defined in

[types/metadata.ts:12](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/metadata.ts#L12)

___

### PrincipalValue

Ƭ **PrincipalValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Principal` | `string` |

#### Defined in

[types/metadata.ts:20](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/metadata.ts#L20)

___

### TextValue

Ƭ **TextValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Text` | `string` |

#### Defined in

[types/metadata.ts:8](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/metadata.ts#L8)

___

### ThawedArrayValue

Ƭ **ThawedArrayValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Array` | { `thawed`: [`MetadataClass`](modules.md#metadataclass)[] \| [`PrincipalValue`](modules.md#principalvalue)[]  } |
| `Array.thawed` | [`MetadataClass`](modules.md#metadataclass)[] \| [`PrincipalValue`](modules.md#principalvalue)[] |

#### Defined in

[types/metadata.ts:24](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/types/metadata.ts#L24)

## Functions

### config

▸ **config**(`args`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`ConfigArgs`](modules.md#configargs) |

#### Returns

`string`

#### Defined in

[methods/config.ts:245](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/methods/config.ts#L245)

___

### parseConfigArgs

▸ **parseConfigArgs**(`argv`): [`ConfigArgs`](modules.md#configargs)

#### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | `string`[] |

#### Returns

[`ConfigArgs`](modules.md#configargs)

#### Defined in

[methods/config.ts:42](https://github.com/ORIGYN-SA/csm/blob/72a08e3/src/methods/config.ts#L42)
