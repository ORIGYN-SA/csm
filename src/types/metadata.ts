import type { CandyShared, PropertyShared } from '../idl/origyn_nft_reference.did.d.js';

export type LocationType = 'collection' | 'canister' | 'web';
export type AssetType = 'primary' | 'hidden' | 'experience' | 'preview';

export interface LibraryFile {
  library_id: string;
  library_file: string;
}

export interface TextValue {
  Text: string;
}

export interface NatValue {
  Nat: bigint;
}

export interface FloatValue {
  Float: number;
}

export interface BoolValue {
  Bool: boolean;
}

export interface ArrayValue {
  Array: CandyShared[];
}

export interface MetadataClass {
  Class: PropertyShared[];
}

export interface Meta {
  metadata: MetadataClass;
}

export interface MetaWithLibrary {
  meta: Meta;
  library: LibraryFile[];
}
