[@origyn/csm](README.md) / Exports

# @origyn/csm

## Table of contents

### Interfaces

- [ArrayValue](interfaces/ArrayValue.md)
- [AssetTypeMap](interfaces/AssetTypeMap.md)
- [BoolValue](interfaces/BoolValue.md)
- [ConfigArgs](interfaces/ConfigArgs.md)
- [ConfigFile](interfaces/ConfigFile.md)
- [ConfigSettings](interfaces/ConfigSettings.md)
- [ConfigSummary](interfaces/ConfigSummary.md)
- [CustomRoyaltyRate](interfaces/CustomRoyaltyRate.md)
- [FileInfo](interfaces/FileInfo.md)
- [FileInfoMap](interfaces/FileInfoMap.md)
- [FloatValue](interfaces/FloatValue.md)
- [LibraryFile](interfaces/LibraryFile.md)
- [Meta](interfaces/Meta.md)
- [MetaWithLibrary](interfaces/MetaWithLibrary.md)
- [MetadataClass](interfaces/MetadataClass.md)
- [Metrics](interfaces/Metrics.md)
- [NatValue](interfaces/NatValue.md)
- [Royalties](interfaces/Royalties.md)
- [RoyaltyPayees](interfaces/RoyaltyPayees.md)
- [RoyaltyRates](interfaces/RoyaltyRates.md)
- [Social](interfaces/Social.md)
- [StageArgs](interfaces/StageArgs.md)
- [TextValue](interfaces/TextValue.md)

### Type Aliases

- [AssetType](modules.md#assettype)
- [LocationType](modules.md#locationtype)
- [LoggerCallback](modules.md#loggercallback)
- [MintArgs](modules.md#mintargs)

### Functions

- [config](modules.md#config)
- [mint](modules.md#mint)
- [parseConfigArgs](modules.md#parseconfigargs)
- [parseMintArgs](modules.md#parsemintargs)
- [parseStageArgs](modules.md#parsestageargs)
- [registerLogger](modules.md#registerlogger)
- [stage](modules.md#stage)
- [unregisterLogger](modules.md#unregisterlogger)

## Type Aliases

### AssetType

Ƭ **AssetType**: ``"primary"`` \| ``"hidden"`` \| ``"experience"`` \| ``"preview"``

#### Defined in

types/metadata.ts:4

___

### LocationType

Ƭ **LocationType**: ``"collection"`` \| ``"canister"`` \| ``"web"``

#### Defined in

types/metadata.ts:3

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

types/logger.ts:1

___

### MintArgs

Ƭ **MintArgs**: [`StageArgs`](interfaces/StageArgs.md) & { `batchSize?`: `string` ; `range?`: `string`  }

#### Defined in

types/mint.ts:3

## Functions

### config

▸ **config**(`args`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`ConfigArgs`](interfaces/ConfigArgs.md) |

#### Returns

`string`

#### Defined in

methods/config.ts:32

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

methods/mint.ts:12

___

### parseConfigArgs

▸ **parseConfigArgs**(`argv`): [`ConfigArgs`](interfaces/ConfigArgs.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | `string`[] |

#### Returns

[`ConfigArgs`](interfaces/ConfigArgs.md)

#### Defined in

methods/arg-parser.ts:6

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

methods/arg-parser.ts:89

___

### parseStageArgs

▸ **parseStageArgs**(`argv`): [`StageArgs`](interfaces/StageArgs.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | `string`[] |

#### Returns

[`StageArgs`](interfaces/StageArgs.md)

#### Defined in

methods/arg-parser.ts:68

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

methods/logger.ts:5

___

### stage

▸ **stage**(`args`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `args` | [`StageArgs`](interfaces/StageArgs.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

methods/stage.ts:15

___

### unregisterLogger

▸ **unregisterLogger**(): `void`

#### Returns

`void`

#### Defined in

methods/logger.ts:9
