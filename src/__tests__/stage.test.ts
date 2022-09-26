import { stage } from '../methods/stage';
import { StageArgs } from '../types/stage';
// import { registerLogger } from '../methods/logger';

const TEN_MINUTE_TIMEOUT = 10 * 60 * 1000;

const inputStageArgs =
  '{"environment":"local","folderPath":"/Users/jt/test/origyn_nft_reference/projects/bayc-csm/__temp","keyFilePath":"/Users/jt/test/origyn_nft_reference/seed.txt"}';

describe('stage module', () => {
  describe('stage', () => {
    test(
      'should complete without throwing an error',
      async () => {
        // registerLogger((message: string) => {
        //   console.log(message);
        // });

        const args = JSON.parse(inputStageArgs) as StageArgs;
        await expect(stage(args)).resolves.not.toThrowError();
      },
      TEN_MINUTE_TIMEOUT,
    );
  });
});
