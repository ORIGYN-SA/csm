import fetch from 'node-fetch';
import { Principal } from '@dfinity/principal';
import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { idlFactory } from '../idl/origyn_nft_reference.did';
import { AnyActor } from '../types/actor';
import { getIdentity } from './identity';

export async function getActor(isProd: boolean, keyFilePath: string, canisterId: string): Promise<AnyActor> {
  const identity = await getIdentity(keyFilePath);

  const agent = getAgent(isProd ? 'https://boundary.ic0.app' : 'http://localhost:8000', identity);
  if (!isProd) {
    agent.fetchRootKey();
  }

  const actor: AnyActor = Actor.createActor(idlFactory, {
    agent: agent,
    canisterId: Principal.fromText(canisterId),
  });

  return actor;
}

function getAgent(host: string, identity: Identity | Promise<Identity>) {
  return new HttpAgent({
    fetch: fetch,
    host: host,
    identity: identity,
  });
}
