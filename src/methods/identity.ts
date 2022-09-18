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
      const rawBuffer = Uint8Array.from(contents as any).buffer;
      const privateKey = Uint8Array.from(sha256(rawBuffer as any, { asBytes: true }));
      const identity = Secp256k1KeyIdentity.fromSecretKey(privateKey);
      log(`Loaded Secp256k1 identity ${identity.getPrincipal()} from .pem file ${keyFilePath}.`);
      return identity;
    } else if (contents.indexOf('BEGIN PRIVATE KEY')) {
      var buf = pemfile.decode(contents);
      if (buf.length != 85) {
        throw 'expecting byte length 85 but got ' + buf.length;
      }
      let privateKey = Buffer.concat([buf.slice(16, 48), buf.slice(53, 85)]);
      const identity = Ed25519KeyIdentity.fromSecretKey(privateKey);
      log(`Loaded Ed25519 identity ${identity.getPrincipal()} from .pem file ${keyFilePath}.`);
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
    log(`Loaded identity ${identity.getPrincipal()} from seed phrase file ${keyFilePath}.`);
    return identity;
  } else {
    log(`Invalid seed phrase file ${keyFilePath}`);
    throw 'Invalid seed phrase';
  }
}
