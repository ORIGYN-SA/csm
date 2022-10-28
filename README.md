## ORIGYN csm

JavaScript library for configuring, staging and minting Origyn NFTs from a local directory.

### Installation

```
npm i @origyn-sa/csm
```

### Local testing of unpublished csm

If you have a local repository of the csm code, you can make npm point to its build using:

```
npm i <path-to-csm>
```

### Usage

Start by importing the `csm` in your code.

```js
import { config, stage, mint } from '@origyn-sa/csm';
```

For a full example see https://github.com/ORIGYN-SA/minting-starter.
