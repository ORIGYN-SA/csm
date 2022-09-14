@origyn-sa/csm / [Exports](modules.md)

## ORIGYN csm

JavaScript library for configuring, staging and minting Origyn NFTs from a local directory.

### Getting Started

In order to have a complete installation of the required packages, you will need to setup a [personal access token](https://github.com/settings/tokens) with `repo` and `read:packages` access. You will need this access token in order to use it as a password when running:

```
npm login --registry=https://npm.pkg.github.com --scope=@origyn-sa
```

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

TODO: Provide usage instructions.
