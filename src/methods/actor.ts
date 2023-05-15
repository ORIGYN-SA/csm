import type { ActorSubclass } from '@dfinity/agent';
import type { OrigynNftCanister } from '../idl/origyn_nft_reference.did.d.js';
import { idlFactory } from '../idl/origyn_nft_reference.did.js';
import { getActor } from '@origyn/actor-reference';

let actor: ActorSubclass<OrigynNftCanister> | null = null;

export const getOrigynNftActor = async (
  canisterId: string,
  pemFilePath: string,
  isLocal: boolean,
): Promise<ActorSubclass<OrigynNftCanister>> => {
  if (actor === null || actor === undefined) {
    actor = await getActor<OrigynNftCanister>({
      canisterId,
      idlFactory,
      isLocal,
      secret: { pemFilePath },
    });
  }
  return actor;
};
