[@origyn/csm](README.md) / Exports

# @origyn/csm

## Table of contents

### Type Aliases

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
- [FrozenArrayValue](modules.md#frozenarrayvalue)
- [LibraryFile](modules.md#libraryfile)
- [LocationType](modules.md#locationtype)
- [LoggerCallback](modules.md#loggercallback)
- [Meta](modules.md#meta)
- [MetadataClass](modules.md#metadataclass)
- [MetadataProperty](modules.md#metadataproperty)
- [Metrics](modules.md#metrics)
- [MintArgs](modules.md#mintargs)
- [NatValue](modules.md#natvalue)
- [PrincipalValue](modules.md#principalvalue)
- [Royalties](modules.md#royalties)
- [RoyaltyPayees](modules.md#royaltypayees)
- [RoyaltyRates](modules.md#royaltyrates)
- [StageArgs](modules.md#stageargs)
- [TextValue](modules.md#textvalue)
- [ThawedArrayValue](modules.md#thawedarrayvalue)

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

### AssetType

Ƭ **AssetType**: ``"primary"`` \| ``"hidden"`` \| ``"experience"`` \| ``"preview"``

#### Defined in

[types/metadata.ts:2](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L2)

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

[types/config.ts:71](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/config.ts#L71)

___

### BoolValue

Ƭ **BoolValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Bool` | `boolean` |

#### Defined in

[types/metadata.ts:21](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L21)

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
| `soulbound` | `string` |

#### Defined in

[types/config.ts:3](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/config.ts#L3)

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

[types/config.ts:85](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/config.ts#L85)

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
| `stageFolder` | `string` |
| `tokenIds` | `string`[] |
| `totalFileSize` | `number` |
| `totalNftCount` | `number` |

#### Defined in

[types/config.ts:43](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/config.ts#L43)

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

[types/config.ts:78](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/config.ts#L78)

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

[types/config.ts:92](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/config.ts#L92)

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

[types/config.ts:59](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/config.ts#L59)

___

### FileInfoMap

Ƭ **FileInfoMap**: `Object`

#### Index signature

▪ [filePath: `string`]: [`FileInfo`](modules.md#fileinfo)

#### Defined in

[types/config.ts:67](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/config.ts#L67)

___

### FloatValue

Ƭ **FloatValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Float` | `number` |

#### Defined in

[types/metadata.ts:17](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L17)

___

### FrozenArrayValue

Ƭ **FrozenArrayValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Array` | { `frozen`: [`MetadataClass`](modules.md#metadataclass)[] \| [`PrincipalValue`](modules.md#principalvalue)[]  } |
| `Array.frozen` | [`MetadataClass`](modules.md#metadataclass)[] \| [`PrincipalValue`](modules.md#principalvalue)[] |

#### Defined in

[types/metadata.ts:29](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L29)

___

### LibraryFile

Ƭ **LibraryFile**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `library_file` | `string` |
| `library_id` | `string` |

#### Defined in

[types/metadata.ts:4](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L4)

___

### LocationType

Ƭ **LocationType**: ``"collection"`` \| ``"canister"`` \| ``"web"``

#### Defined in

[types/metadata.ts:1](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L1)

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

[types/logger.ts:1](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/logger.ts#L1)

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

[types/metadata.ts:47](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L47)

___

### MetadataClass

Ƭ **MetadataClass**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Class` | [`MetadataProperty`](modules.md#metadataproperty)[] |

#### Defined in

[types/metadata.ts:43](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L43)

___

### MetadataProperty

Ƭ **MetadataProperty**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `immutable` | `boolean` |
| `name` | `string` |
| `value` | [`BoolValue`](modules.md#boolvalue) \| [`NatValue`](modules.md#natvalue) \| [`FloatValue`](modules.md#floatvalue) \| [`TextValue`](modules.md#textvalue) \| [`PrincipalValue`](modules.md#principalvalue) \| [`FrozenArrayValue`](modules.md#frozenarrayvalue) \| [`ThawedArrayValue`](modules.md#thawedarrayvalue) \| [`MetadataClass`](modules.md#metadataclass) |

#### Defined in

[types/metadata.ts:37](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L37)

___

### Metrics

Ƭ **Metrics**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `totalFileSize` | `number` |

#### Defined in

[types/stage.ts:7](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/stage.ts#L7)

___

### MintArgs

Ƭ **MintArgs**: [`StageArgs`](modules.md#stageargs) & { `batchSize?`: `string` ; `range?`: `string`  }

#### Defined in

[types/mint.ts:3](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/mint.ts#L3)

___

### NatValue

Ƭ **NatValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Nat` | `bigint` |

#### Defined in

[types/metadata.ts:13](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L13)

___

### PrincipalValue

Ƭ **PrincipalValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Principal` | `string` |

#### Defined in

[types/metadata.ts:25](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L25)

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

[types/config.ts:112](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/config.ts#L112)

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

[types/config.ts:98](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/config.ts#L98)

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

[types/config.ts:104](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/config.ts#L104)

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

[types/stage.ts:1](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/stage.ts#L1)

___

### TextValue

Ƭ **TextValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Text` | `string` |

#### Defined in

[types/metadata.ts:9](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L9)

___

### ThawedArrayValue

Ƭ **ThawedArrayValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Array` | { `thawed`: [`MetadataClass`](modules.md#metadataclass)[] \| [`PrincipalValue`](modules.md#principalvalue)[]  } |
| `Array.thawed` | [`MetadataClass`](modules.md#metadataclass)[] \| [`PrincipalValue`](modules.md#principalvalue)[] |

#### Defined in

[types/metadata.ts:33](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/types/metadata.ts#L33)

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

[methods/config.ts:30](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/methods/config.ts#L30)

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

[methods/identity.ts:29](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/methods/identity.ts#L29)

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

[methods/mint.ts:12](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/methods/mint.ts#L12)

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

[methods/arg-parser.ts:7](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/methods/arg-parser.ts#L7)

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

[methods/identity.ts:66](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/methods/identity.ts#L66)

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

[methods/arg-parser.ts:81](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/methods/arg-parser.ts#L81)

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

[methods/identity.ts:84](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/methods/identity.ts#L84)

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

[methods/arg-parser.ts:62](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/methods/arg-parser.ts#L62)

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

[methods/logger.ts:5](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/methods/logger.ts#L5)

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

[methods/stage.ts:15](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/methods/stage.ts#L15)

___

### unregisterLogger

▸ **unregisterLogger**(): `void`

#### Returns

`void`

#### Defined in

[methods/logger.ts:9](https://github.com/ORIGYN-SA/csm/blob/e176d86/src/methods/logger.ts#L9)
