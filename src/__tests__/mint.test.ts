import { mint } from '../methods/mint';
import { MintArgs } from '../types/mint';
// import { registerLogger } from '../methods/logger';

const TEN_MINUTE_TIMEOUT = 10 * 60 * 1000;

const inputMintArgs =
  '{"folderPath":"/Users/jt/test/origyn_nft_reference/projects/bayc-csm/__temp","keyFilePath":"/Users/jt/test/origyn_nft_reference/seed.txt"}';

describe('mint module', () => {
  describe('mint', () => {
    test(
      'should complete without throwing an error',
      async () => {
        // registerLogger((message: string) => {
        //   console.log(message);
        // });

        const args = JSON.parse(inputMintArgs) as MintArgs;
        await expect(mint(args)).resolves.not.toThrowError();
      },
      TEN_MINUTE_TIMEOUT,
    );
  });
});
