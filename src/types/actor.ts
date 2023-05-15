import type { ActorMethod, ActorSubclass } from '@dfinity/agent';

export type AnyActor = ActorSubclass<Record<string, ActorMethod<unknown[], unknown>>>;
