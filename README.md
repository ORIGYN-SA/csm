## ORIGYN CSM

JavaScript library for configuring, staging and minting Origyn NFTs from a local directory.

### Compatibility

Each release of `csm` is compatible with a specific version of the `Origyn NFT standard`. The table below shows the compatibility between the two.

| CSM Version  | Origyn NFT Version |
| ------------ | ------------------ |
| 1.0.0-beta.7 | 0.1.4              |
| 1.0.0-beta.6 | 0.1.4              |
| 1.0.0-beta.5 | 0.1.3              |

### Installation

```
npm i @origyn/csm
```

### Local testing of unpublished csm

If you have a local repository of the csm code, you can make npm point to its build using:

```
npm i <path-to-csm>
```

### Usage

Start by importing the `csm` in your code.

```js
import { config, stage, mint } from '@origyn/csm';
```

For a full example see https://github.com/ORIGYN-SA/minting-starter.
