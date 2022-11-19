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
- [CustomRoyaltyRate](modules.md#customroyaltyrate)
- [FileInfo](modules.md#fileinfo)
- [FileInfoMap](modules.md#fileinfomap)
- [FloatValue](modules.md#floatvalue)
- [FrozenArrayValue](modules.md#frozenarrayvalue)
- [LibraryFile](modules.md#libraryfile)
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

[types/config.ts:74](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/config.ts#L74)

___

### BoolValue

Ƭ **BoolValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Bool` | `boolean` |

#### Defined in

[types/metadata.ts:20](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/metadata.ts#L20)

___

### ConfigArgs

Ƭ **ConfigArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `assetMappings` | `string` |
| `collectionDisplayName` | `string` |
| `collectionId` | `string` |
| `creatorPrincipal` | `string` |
| `folderPath` | `string` |
| `maxWords` | `string` |
| `minWords` | `string` |
| `namespace` | `string` |
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
| `tokenPrefix` | `string` |
| `tokenWords` | `string` |

#### Defined in

[types/config.ts:3](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/config.ts#L3)

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

[types/config.ts:88](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/config.ts#L88)

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

[types/config.ts:47](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/config.ts#L47)

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

[types/config.ts:81](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/config.ts#L81)

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

[types/config.ts:95](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/config.ts#L95)

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

[types/config.ts:63](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/config.ts#L63)

___

### FileInfoMap

Ƭ **FileInfoMap**: `Object`

#### Index signature

▪ [filePath: `string`]: [`FileInfo`](modules.md#fileinfo)

#### Defined in

[types/config.ts:70](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/config.ts#L70)

___

### FloatValue

Ƭ **FloatValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Float` | `number` |

#### Defined in

[types/metadata.ts:16](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/metadata.ts#L16)

___

### FrozenArrayValue

Ƭ **FrozenArrayValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Array` | { `frozen`: [`MetadataClass`](modules.md#metadataclass)[] \| [`PrincipalValue`](modules.md#principalvalue)[]  } |
| `Array.frozen` | [`MetadataClass`](modules.md#metadataclass)[] \| [`PrincipalValue`](modules.md#principalvalue)[] |

#### Defined in

[types/metadata.ts:28](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/metadata.ts#L28)

___

### LibraryFile

Ƭ **LibraryFile**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `library_file` | `string` |
| `library_id` | `string` |

#### Defined in

[types/metadata.ts:3](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/metadata.ts#L3)

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

[types/logger.ts:1](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/logger.ts#L1)

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

[types/metadata.ts:46](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/metadata.ts#L46)

___

### MetadataClass

Ƭ **MetadataClass**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Class` | [`MetadataProperty`](modules.md#metadataproperty)[] |

#### Defined in

[types/metadata.ts:42](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/metadata.ts#L42)

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

[types/metadata.ts:36](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/metadata.ts#L36)

___

### Metrics

Ƭ **Metrics**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `totalFileSize` | `number` |

#### Defined in

[types/stage.ts:7](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/stage.ts#L7)

___

### MintArgs

Ƭ **MintArgs**: [`StageArgs`](modules.md#stageargs) & { `batchSize?`: `string` ; `range?`: `string`  }

#### Defined in

[types/mint.ts:3](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/mint.ts#L3)

___

### NatValue

Ƭ **NatValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Nat` | `number` |

#### Defined in

[types/metadata.ts:12](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/metadata.ts#L12)

___

### PrincipalValue

Ƭ **PrincipalValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Principal` | `string` |

#### Defined in

[types/metadata.ts:24](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/metadata.ts#L24)

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

[types/config.ts:115](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/config.ts#L115)

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

[types/config.ts:101](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/config.ts#L101)

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

[types/config.ts:107](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/config.ts#L107)

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

[types/stage.ts:1](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/stage.ts#L1)

___

### TextValue

Ƭ **TextValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Text` | `string` |

#### Defined in

[types/metadata.ts:8](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/metadata.ts#L8)

___

### ThawedArrayValue

Ƭ **ThawedArrayValue**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `Array` | { `thawed`: [`MetadataClass`](modules.md#metadataclass)[] \| [`PrincipalValue`](modules.md#principalvalue)[]  } |
| `Array.thawed` | [`MetadataClass`](modules.md#metadataclass)[] \| [`PrincipalValue`](modules.md#principalvalue)[] |

#### Defined in

[types/metadata.ts:32](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/types/metadata.ts#L32)

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

[methods/config.ts:14](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/methods/config.ts#L14)

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

[methods/identity.ts:29](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/methods/identity.ts#L29)

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

[methods/mint.ts:11](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/methods/mint.ts#L11)

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

[methods/arg-parser.ts:6](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/methods/arg-parser.ts#L6)

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

[methods/identity.ts:66](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/methods/identity.ts#L66)

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

[methods/arg-parser.ts:88](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/methods/arg-parser.ts#L88)

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

[methods/identity.ts:84](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/methods/identity.ts#L84)

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

[methods/arg-parser.ts:69](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/methods/arg-parser.ts#L69)

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

[methods/logger.ts:5](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/methods/logger.ts#L5)

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

[methods/stage.ts:13](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/methods/stage.ts#L13)

___

### unregisterLogger

▸ **unregisterLogger**(): `void`

#### Returns

`void`

#### Defined in

[methods/logger.ts:9](https://github.com/ORIGYN-SA/csm/blob/2f3ffb9/src/methods/logger.ts#L9)
