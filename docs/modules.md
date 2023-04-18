[@origyn/csm](README.md) / Exports

# @origyn/csm

## Table of contents

### Type Aliases

- [ArrayValue](modules.md#arrayvalue)
- [AssetType](modules.md#assettype)
- [AssetTypeMap](modules.md#assettypemap)
- [BoolValue](modules.md#boolvalue)
- [ConfigArgs](modules.md#configargs)
- [ConfigFile](modules.md#configfile)
- [ConfigSettings](modules.md#configsettings)
- [ConfigSummary](modules.md#configsummary)
- [CustomRoyaltyRate](modules.md#customroyaltyrate)
- [FileInfo](modules.md#fileinfo)
- [FileInfoMap](modules.md#fileinfomap)
- [FloatValue](modules.md#floatvalue)
- [LibraryFile](modules.md#libraryfile)
- [LocationType](modules.md#locationtype)
- [LoggerCallback](modules.md#loggercallback)
- [Meta](modules.md#meta)
- [MetadataClass](modules.md#metadataclass)
- [Metrics](modules.md#metrics)
- [MintArgs](modules.md#mintargs)
- [NatValue](modules.md#natvalue)
- [PrincipalValue](modules.md#principalvalue)
- [Royalties](modules.md#royalties)
- [RoyaltyPayees](modules.md#royaltypayees)
- [RoyaltyRates](modules.md#royaltyrates)
- [Social](modules.md#social)
- [StageArgs](modules.md#stageargs)
- [TextValue](modules.md#textvalue)

### Functions

- [config](modules.md#config)
- [getIdentity](modules.md#getidentity)
- [mint](modules.md#mint)
- [parseConfigArgs](modules.md#parseconfigargs)
- [parseEd25519](modules.md#parseed25519)
- [parseMintArgs](modules.md#parsemintargs)
- [parseSec256K1](modules.md#parsesec256k1)
- [parseStageArgs](modules.md#parsestageargs)
- [registerLogger](modules.md#registerlogger)
- [stage](modules.md#stage)
- [unregisterLogger](modules.md#unregisterlogger)

## Type Aliases

### ArrayValue

Ƭ **ArrayValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Array` | `CandyShared`[] |

#### Defined in

[types/metadata.ts:31](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/metadata.ts#L31)

___

### AssetType

Ƭ **AssetType**: ``"primary"`` \| ``"hidden"`` \| ``"experience"`` \| ``"preview"``

#### Defined in

[types/metadata.ts:4](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/metadata.ts#L4)

___

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

[types/config.ts:76](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/config.ts#L76)

___

### BoolValue

Ƭ **BoolValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Bool` | `boolean` |

#### Defined in

[types/metadata.ts:23](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/metadata.ts#L23)

___

### ConfigArgs

Ƭ **ConfigArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `assetMappings` | `string` |
| `collectionId` | `string` |
| `creatorPrincipal` | `string` |
| `description` | `string` |
| `displayName` | `string` |
| `folderPath` | `string` |
| `networkPrincipal` | `string` |
| `nftCanisterId` | `string` |
| `nftOwnerId` | `string` |
| `nftQuantities` | `string` |
| `nodePrincipal` | `string` |
| `originatorPrincipal` | `string` |
| `primaryBrokerRate` | `string` |
| `primaryCustomRates` | `string` |
| `primaryNetworkRate` | `string` |
| `primaryNodeRate` | `string` |
| `primaryOriginatorRate` | `string` |
| `secondaryBrokerRate` | `string` |
| `secondaryCustomRates` | `string` |
| `secondaryNetworkRate` | `string` |
| `secondaryNodeRate` | `string` |
| `secondaryOriginatorRate` | `string` |
| `socials` | `string` |
| `soulbound` | `string` |

#### Defined in

[types/config.ts:3](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/config.ts#L3)

___

### ConfigFile

Ƭ **ConfigFile**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `collection` | [`Meta`](modules.md#meta) |
| `nfts` | [`Meta`](modules.md#meta)[] |
| `settings` | [`ConfigSettings`](modules.md#configsettings) |
| `summary` | [`ConfigSummary`](modules.md#configsummary) |

#### Defined in

[types/config.ts:90](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/config.ts#L90)

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
| `nftQuantities` | `number`[] |
| `nftsFolder` | `string` |
| `royalties` | [`Royalties`](modules.md#royalties) |
| `socials` | [`Social`](modules.md#social)[] |
| `stageFolder` | `string` |
| `tokenIds` | `string`[] |
| `totalFileSize` | `number` |
| `totalNftCount` | `number` |

#### Defined in

[types/config.ts:47](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/config.ts#L47)

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

[types/config.ts:83](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/config.ts#L83)

___

### CustomRoyaltyRate

Ƭ **CustomRoyaltyRate**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `customName` | `string` |
| `principalId` | `string` |
| `rate` | `string` |

#### Defined in

[types/config.ts:97](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/config.ts#L97)

___

### FileInfo

Ƭ **FileInfo**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `immutable?` | `boolean` |
| `libraryId` | `string` |
| `resourceUrl` | `string` |
| `title` | `string` |

#### Defined in

[types/config.ts:64](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/config.ts#L64)

___

### FileInfoMap

Ƭ **FileInfoMap**: `Object`

#### Index signature

▪ [filePath: `string`]: [`FileInfo`](modules.md#fileinfo)

#### Defined in

[types/config.ts:72](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/config.ts#L72)

___

### FloatValue

Ƭ **FloatValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Float` | `number` |

#### Defined in

[types/metadata.ts:19](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/metadata.ts#L19)

___

### LibraryFile

Ƭ **LibraryFile**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `library_file` | `string` |
| `library_id` | `string` |

#### Defined in

[types/metadata.ts:6](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/metadata.ts#L6)

___

### LocationType

Ƭ **LocationType**: ``"collection"`` \| ``"canister"`` \| ``"web"``

#### Defined in

[types/metadata.ts:3](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/metadata.ts#L3)

___

### LoggerCallback

Ƭ **LoggerCallback**: (`log`: `string`) => `void`

#### Type declaration

▸ (`log`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `log` | `string` |

##### Returns

`void`

#### Defined in

[types/logger.ts:1](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/logger.ts#L1)

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

[types/metadata.ts:39](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/metadata.ts#L39)

___

### MetadataClass

Ƭ **MetadataClass**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Class` | `PropertyShared`[] |

#### Defined in

[types/metadata.ts:35](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/metadata.ts#L35)

___

### Metrics

Ƭ **Metrics**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `totalFileSize` | `number` |

#### Defined in

[types/stage.ts:7](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/stage.ts#L7)

___

### MintArgs

Ƭ **MintArgs**: [`StageArgs`](modules.md#stageargs) & { `batchSize?`: `string` ; `range?`: `string`  }

#### Defined in

[types/mint.ts:3](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/mint.ts#L3)

___

### NatValue

Ƭ **NatValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Nat` | `bigint` |

#### Defined in

[types/metadata.ts:15](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/metadata.ts#L15)

___

### PrincipalValue

Ƭ **PrincipalValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Principal` | `string` |

#### Defined in

[types/metadata.ts:27](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/metadata.ts#L27)

___

### Royalties

Ƭ **Royalties**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `payees` | [`RoyaltyPayees`](modules.md#royaltypayees) |
| `rates` | { `primary`: [`RoyaltyRates`](modules.md#royaltyrates) ; `secondary`: [`RoyaltyRates`](modules.md#royaltyrates)  } |
| `rates.primary` | [`RoyaltyRates`](modules.md#royaltyrates) |
| `rates.secondary` | [`RoyaltyRates`](modules.md#royaltyrates) |

#### Defined in

[types/config.ts:117](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/config.ts#L117)

___

### RoyaltyPayees

Ƭ **RoyaltyPayees**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `network` | `string` |
| `node` | `string` |
| `originator` | `string` |

#### Defined in

[types/config.ts:103](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/config.ts#L103)

___

### RoyaltyRates

Ƭ **RoyaltyRates**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `broker` | `string` |
| `custom` | [`CustomRoyaltyRate`](modules.md#customroyaltyrate)[] |
| `network` | `string` |
| `node` | `string` |
| `originator` | `string` |

#### Defined in

[types/config.ts:109](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/config.ts#L109)

___

### Social

Ƭ **Social**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `url` | `string` |

#### Defined in

[types/config.ts:125](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/config.ts#L125)

___

### StageArgs

Ƭ **StageArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `environment` | `string` |
| `folderPath` | `string` |
| `keyFilePath` | `string` |

#### Defined in

[types/stage.ts:1](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/stage.ts#L1)

___

### TextValue

Ƭ **TextValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Text` | `string` |

#### Defined in

[types/metadata.ts:11](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/types/metadata.ts#L11)

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

[methods/config.ts:24](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/methods/config.ts#L24)

___

### getIdentity

▸ **getIdentity**(`keyFilePath`): `Promise`<`Identity`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `keyFilePath` | `string` |

#### Returns

`Promise`<`Identity`\>

#### Defined in

[methods/identity.ts:29](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/methods/identity.ts#L29)

___

### mint

▸ **mint**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`MintArgs`](modules.md#mintargs) |

#### Returns

`Promise`<`void`\>

#### Defined in

[methods/mint.ts:12](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/methods/mint.ts#L12)

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

[methods/arg-parser.ts:7](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/methods/arg-parser.ts#L7)

___

### parseEd25519

▸ **parseEd25519**(`pem`): `undefined` \| `Ed25519KeyIdentity`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pem` | `string` |

#### Returns

`undefined` \| `Ed25519KeyIdentity`

#### Defined in

[methods/identity.ts:66](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/methods/identity.ts#L66)

___

### parseMintArgs

▸ **parseMintArgs**(`argv`): [`MintArgs`](modules.md#mintargs)

#### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | `string`[] |

#### Returns

[`MintArgs`](modules.md#mintargs)

#### Defined in

[methods/arg-parser.ts:82](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/methods/arg-parser.ts#L82)

___

### parseSec256K1

▸ **parseSec256K1**(`pem`): `undefined` \| `Secp256k1KeyIdentity`

#### Parameters

| Name | Type |
| :------ | :------ |
| `pem` | `string` |

#### Returns

`undefined` \| `Secp256k1KeyIdentity`

#### Defined in

[methods/identity.ts:84](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/methods/identity.ts#L84)

___

### parseStageArgs

▸ **parseStageArgs**(`argv`): [`StageArgs`](modules.md#stageargs)

#### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | `string`[] |

#### Returns

[`StageArgs`](modules.md#stageargs)

#### Defined in

[methods/arg-parser.ts:63](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/methods/arg-parser.ts#L63)

___

### registerLogger

▸ **registerLogger**(`callback`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | [`LoggerCallback`](modules.md#loggercallback) |

#### Returns

`void`

#### Defined in

[methods/logger.ts:5](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/methods/logger.ts#L5)

___

### stage

▸ **stage**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`StageArgs`](modules.md#stageargs) |

#### Returns

`Promise`<`void`\>

#### Defined in

[methods/stage.ts:15](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/methods/stage.ts#L15)

___

### unregisterLogger

▸ **unregisterLogger**(): `void`

#### Returns

`void`

#### Defined in

[methods/logger.ts:9](https://github.com/ORIGYN-SA/csm/blob/79e07be/src/methods/logger.ts#L9)
