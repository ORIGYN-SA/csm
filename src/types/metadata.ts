import { ConfigArgs } from './config';

export type LibraryFile = {
  library_id: string;
  library_file: string;
};

export type TextValue = {
  Text: string;
};

export type NatValue = {
  Nat: number;
};

export type FloatValue = {
  Float: number;
}

export type BoolValue = {
  Bool: boolean;
};

export type PrincipalValue = {
  Principal: string;
};

export type FrozenArrayValue = {
  Array: { frozen: MetadataClass[] | PrincipalValue[] };
};

export type ThawedArrayValue = {
  Array: { thawed: MetadataClass[] | PrincipalValue[] };
};

export type MetadataProperty = {
  name: string;
  value: BoolValue | NatValue | FloatValue | TextValue | PrincipalValue | FrozenArrayValue | ThawedArrayValue | MetadataClass;
  immutable: boolean;
};

export type MetadataClass = {
  Class: MetadataProperty[];
};

export type Meta = {
  meta: {
    metadata: MetadataClass;
  };
  library: LibraryFile[];
};
