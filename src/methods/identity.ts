/**
 * Credit:
 * This module has combined code from multiple sources:
 * https://github.com/krpeacock/node-identity-pem
 * https://forum.dfinity.org/t/using-dfinity-agent-in-node-js/6169/41
 * https://forum.dfinity.org/t/using-dfinity-agent-in-node-js/6169/55
 */

import fs from 'fs';
import path from 'path';
import { Identity } from '@dfinity/agent';
import hdkey from 'hdkey';
import pemfile from 'pem-file';
import { mnemonicToSeed } from 'bip39';
import { Secp256k1KeyIdentity, Ed25519KeyIdentity } from '@dfinity/identity';
import { log } from './logger';

// Loads an Ed25519 private key or a Secp256k1 seed phrase from a file and creates
// an Identity that can be used in actor references to call canister functions.
export async function getIdentity(keyFilePath: string): Promise<Identity> {
  const contents = fs.readFileSync(keyFilePath).toString();
  const fileExt = path.extname(keyFilePath).toLowerCase();

  if (fileExt === '.pem' && contents.indexOf('BEGIN PRIVATE KEY') > -1) {
    // Try to load Ed25519 private key
    var buf = pemfile.decode(contents);
    if (buf.length != 85) {
      throw 'expecting byte length 85 but got ' + buf.length;
    }
    let privateKey = Buffer.concat([buf.slice(16, 48), buf.slice(53, 85)]);
    const identity = Ed25519KeyIdentity.fromSecretKey(privateKey);
    log(`Loaded Ed25519 identity ${identity.getPrincipal()} from .pem file ${keyFilePath}.`);
    return identity;
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
