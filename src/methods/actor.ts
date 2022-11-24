import { Principal } from '@dfinity/principal';
import { Actor, ActorSubclass, HttpAgent, Identity } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { _SERVICE as OrigynNftCanister } from '../idl/origyn_nft_reference.did.d.js';
import { idlFactory as OrigynNftIdlFactory } from '../idl/origyn_nft_reference.did.js';
import { getIdentity } from './identity.js';
import fetch from 'node-fetch';

export type ActorOptions = {
  canisterId: string,
  canisterIdlFactory: IDL.InterfaceFactory,
  identity?: Identity,
  isLocal?: boolean,
}

export const getOrigynNftActor = async (isLocal: boolean, keyFilePath: string, canisterId: string) : Promise<ActorSubclass<OrigynNftCanister>> => {
  const identity = await getIdentity(keyFilePath);

  return getActor<OrigynNftCanister>({
    canisterId,
    canisterIdlFactory: OrigynNftIdlFactory,
    identity,
    isLocal
  });
}

export const getActor = async <T>(options: ActorOptions): Promise<ActorSubclass<T>> => {

  const agent = new HttpAgent({
    fetch: fetch as any,
    host: options.isLocal ? 'http://localhost:8000' : 'https://boundary.ic0.app',
    identity: options.identity,
  });

  if (options.isLocal) {
    agent.fetchRootKey();
  }

  const actor: ActorSubclass<T> = Actor.createActor(options.canisterIdlFactory, {
    agent,
    canisterId: Principal.fromText(options.canisterId),
  });

  return actor;
}
