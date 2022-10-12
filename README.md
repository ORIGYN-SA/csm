## ORIGYN csm

JavaScript library for configuring, staging and minting Origyn NFTs from a local directory.

### Getting Started

In order to have a complete installation of the required packages, you will need to setup a [personal access token](https://github.com/settings/tokens) with the `repo` and `read:packages` scopes.

Run the following to login and provide your access token as the password:

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

