/**
 * Credit:
 * This code has combined code from 2 sources:
 * https://github.com/krpeacock/node-identity-pem
 * https://github.com/ZenVoich/mops/blob/4bf6487deb7e4d3b83eabcd2c7323d9eb231e5a5/cli/pem.js
 */

import fs from 'fs';
import path from 'path';
import { Identity } from '@dfinity/agent';
import hdkey from 'hdkey';
import sha256 from 'sha256';
import pemfile from 'pem-file';
import { mnemonicToSeed } from 'bip39';
import { Secp256k1KeyIdentity, Ed25519KeyIdentity } from '@dfinity/identity';
import { log } from './logger';

export async function getIdentity(keyFilePath: string): Promise<Identity> {
  const contents = fs.readFileSync(keyFilePath).toString();
  const fileExt = path.extname(keyFilePath).toLowerCase();

  if (fileExt === '.pem') {
    if (contents.indexOf('BEGIN EC PRIVATE KEY') > -1) {
      console.log('Secp256k1 Key Identity');
      const rawBuffer = Uint8Array.from(contents as any).buffer;
      const privateKey = Uint8Array.from(sha256(rawBuffer as any, { asBytes: true }));
      const identity = Secp256k1KeyIdentity.fromSecretKey(privateKey);
      log(`Loaded identity ${identity.getPrincipal()} from .pem file ${keyFilePath}.`);
      return identity;
    } else if (contents.indexOf('BEGIN PRIVATE KEY')) {
      console.log('Ed25519 Key Identity');
      var buf = pemfile.decode(contents);
      if (buf.length != 85) {
        throw 'expecting byte length 85 but got ' + buf.length;
      }
      let privateKey = Buffer.concat([buf.slice(16, 48), buf.slice(53, 85)]);
      const identity = Ed25519KeyIdentity.fromSecretKey(privateKey);
      console.log(identity.getPrincipal().toText());
      return identity;
    } else {
      throw 'Could not recognize the private key type.';
    }
  } else if ((contents || '').split(' ').length === 12) {
    // seed file
    let seed: Buffer = await mnemonicToSeed(contents);
    const root = hdkey.fromMasterSeed(seed);
    const addrnode = root.derive("m/44'/223'/0'/0/0");
    const identity = Secp256k1KeyIdentity.fromSecretKey(addrnode.privateKey);
    log(`Loaded identity ${identity.getPrincipal()} from key phrase file ${keyFilePath}.`);
    return identity;
  } else {
    log(`Invalid seed phrase file ${keyFilePath}`);
    throw 'Invalid seed phrase';
  }
}
