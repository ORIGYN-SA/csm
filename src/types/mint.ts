import { StageArgs } from './stage';

export type MintArgs = StageArgs & {
  range?: string;
  batchSize?: string;
};
