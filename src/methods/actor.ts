import fs from 'fs';
import fetch from 'node-fetch';
import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import hdkey from 'hdkey';
import { mnemonicToSeed } from 'bip39';
import { idlFactory } from '../idl/origyn_nft_reference.did';
import { Secp256k1KeyIdentity } from '@dfinity/identity';

export async function getActor(isProd: boolean, seedFile: string, canisterId: string) {
  const identity = await getIdentity(seedFile);

  const agent = getAgent(isProd ? 'https://boundary.ic0.app' : 'http://localhost:8000', identity);
  if (!isProd) {
    agent.fetchRootKey();
  }

  const actor = Actor.createActor(idlFactory, {
    agent: agent,
    canisterId: Principal.fromText(canisterId),
  });

  return actor;
}

async function getIdentity(seedFile: string) {
  const phrase = fs.readFileSync(seedFile, { encoding: 'utf8', flag: 'r' }).trim();

  if ((phrase || '').split(' ').length !== 12) {
    throw 'Invalid seed phrase';
  }

  let seed: Buffer = await mnemonicToSeed(phrase);
  const root = hdkey.fromMasterSeed(seed);
  const addrnode = root.derive("m/44'/223'/0'/0/0");

  return Secp256k1KeyIdentity.fromSecretKey(addrnode.privateKey);
}

function getAgent(host: string, identity: Identity | Promise<Identity>) {
  return new HttpAgent({
    fetch: fetch,
    host: host,
    identity: identity, //await window.plug.getIdentity()
  });
}
