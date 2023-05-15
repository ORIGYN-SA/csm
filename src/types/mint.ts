import type { StageArgs } from './stage.js';

export type MintArgs = StageArgs & {
  range?: string;
  batchSize?: string;
};
