/**
 * Credit:
 * This module has combined code from multiple sources:
 * https://github.com/Psychedelic/plug-controller/blob/eadc90de738a7fb3d338203540919000f5fd768b/src/utils/identity/parsePem.ts
 * https://github.com/krpeacock/node-identity-pem
 * 
 */

import fs from 'fs';
import path from 'path';
import { Identity } from '@dfinity/agent';
import { Secp256k1KeyIdentity, Ed25519KeyIdentity } from '@dfinity/identity';
import { mnemonicToSeed } from 'bip39';
import hdkey from 'hdkey';

import { log } from './logger';

const ED25519_KEY_INIT = '3053020101300506032b657004220420';
const ED25519_KEY_SEPARATOR = 'a123032100';
const ED25519_OID = '06032b6570';

const SEC256k1_KEY_INIT = '30740201010420';
const SEC256k1_KEY_SEPARATOR = 'a00706052b8104000aa144034200';
const SEC256k1_OID = '06052b8104000a';


// Loads an Ed25519 private key or a Secp256k1 seed phrase from a file and creates
// an Identity that can be used in actor references to call canister functions.
export async function getIdentity(keyFilePath: string): Promise<Identity> {
  const contents = fs.readFileSync(keyFilePath).toString();
  const fileExt = path.extname(keyFilePath).toLowerCase();

  if (fileExt === '.pem') {

    // Try to load Ed25519 or Sepk256k1 private key
    const trimedPem = contents
      .replace(/(-{5}.*-{5})/g, '')
      .replace('\n', '')
      // Sepk256k1 keys
      .replace('BgUrgQQACg==', '')
      .trim();

    const parsedIdentity = parseEd25519(trimedPem) || parseSec256K1(trimedPem);

    if (!parsedIdentity) {
      const err = `Invalid private key at ${keyFilePath}. Expected Ed25519 or Sepk256k1 key.`;
      throw err;
    }

    return parsedIdentity;

  } else if ((contents || '').split(' ').length === 12) {
    // Try to load Secp256k1 seed file
    let seed: Buffer = await mnemonicToSeed(contents);
    const root = hdkey.fromMasterSeed(seed);
    const addrnode = root.derive("m/44'/223'/0'/0/0");
    const identity = Secp256k1KeyIdentity.fromSecretKey(addrnode.privateKey);
    log(`Loaded identity ${identity.getPrincipal()} from seed phrase file ${keyFilePath}.`);
    return identity;
  } else {
    const err = `Could not load identity from ${keyFilePath}`;
    throw err;
  }
}

export const parseEd25519 = (pem: string) => {
  const raw = Buffer.from(pem, 'base64').toString('hex');

  if (!raw.substring(0, 24).includes(ED25519_OID)) {
    return undefined;
  }

  const trimRaw = raw.replace(ED25519_KEY_INIT, '').replace(ED25519_KEY_SEPARATOR, '');

  try {
    const key = new Uint8Array(Buffer.from(trimRaw, 'hex'));
    const identity = Ed25519KeyIdentity.fromSecretKey(key);
    return identity;
  } catch {
    return undefined;
  }
};

export const parseSec256K1 = (pem: string) => {
  const raw = Buffer.from(pem, 'base64').toString('hex');

  if (!raw.includes(SEC256k1_OID)) {
    return undefined;
  }

  const trimRaw = raw.replace(SEC256k1_KEY_INIT, '').replace(SEC256k1_KEY_SEPARATOR, '');

  try {
    const key = new Uint8Array(Buffer.from(trimRaw.substring(0, 64), 'hex'));
    const identity = Secp256k1KeyIdentity.fromSecretKey(key);
    return identity;
  } catch {
    return undefined;
  }
};
