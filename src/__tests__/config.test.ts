import rewire from 'rewire';
import path from 'path';
import { parseConfigArgs } from '../methods/arg-parser';
import { config } from '../methods/config';
import { ConfigArgs } from '../types/config';
// import { registerLogger } from '../methods/logger';

const BUILD_FOLDER = '../../lib';
const inputArgvShortNames =
  '["/Users/jt/.nvm/versions/node/v16.15.1/bin/node","/Users/jt/test/origyn_nft_reference/projects/csm.js","config","-c","bayc","-d","BAYC","-t","bayc-","-n","com.bayc.ape","-i","aaaaa-bbbbb-ccccc-ddddd-cai","-p","11111-22222-33333-44444-55555-66666-77777-88888-99999-11111-222","-s","true","-f","./projects/bayc-csm/__temp","-m","primary:ape*.png, preview:index.html, hidden:mystery-ape.gif","-o","aaaaa-bbbbb-ccccc-ddddd-eeeee-fffff-ggggg-iiiii-jjjjj-kkkkk-lll","-s","true","-q","5,5,5,5,1,1,1"]';
const inputArgvShortNamesOmitOptional =
  '["/Users/jt/.nvm/versions/node/v16.15.1/bin/node","/Users/jt/test/origyn_nft_reference/projects/csm.js","config",,"-c","bayc","-d","BAYC","-t","bayc-","-n","com.bayc.ape","-i","rrkah-fqaaa-aaaaa-aaaaq-cai","-p","6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe","-f","./projects/bayc-csm/__temp","-m","primary:ape*.png, preview:index.html, hidden:mystery-ape.gif"]';
const inputArgvLongNames =
  '["/Users/jt/.nvm/versions/node/v16.15.1/bin/node","/Users/jt/test/origyn_nft_reference/projects/csm.js","config","--collectionId","simple","--collectionDisplayName","Simple","--tokenPrefix","simple_","--nftCanisterId","rrkah-fqaaa-aaaaa-aaaaq-cai","--creatorPrincipal","6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe","--namespace","ogy.simple","--folderPath","./projects/simple-video/assets","--assetMappings","primary:mike.png, experience:Origynator_Card_Mike_Schwartz_Small.mp4, preview:index.html","--soulbound","false","--nftQuantities","3"]';

const inputConfigArgs =
  '{"collectionId":"bayc","collectionDisplayName":"BAYC","tokenPrefix":"bayc-","nftCanisterId":"rrkah-fqaaa-aaaaa-aaaaq-cai","creatorPrincipal":"6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe","namespace":"com.bayc.ape","folderPath":"/Users/jt/test/origyn_nft_reference/projects/bayc-csm/__temp","assetMappings":"primary:ape*.png, preview:index.html, hidden:mystery-ape.gif","nftOwnerId":"6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe","soulbound":"false","nftQuantities":""}';

xdescribe('config module', () => {
  describe('getArgValue', () => {
    test('should return string value of string object key "c"', () => {
      const configModule = rewire(`${BUILD_FOLDER}/methods/arg-parser`);
      const getArgValue = configModule.__get__('getArgValue');

      const expected = 'bayc';
      const actual = getArgValue(JSON.parse(inputArgvShortNames), ['-c']);

      expect(actual).toEqual(expected);
    });

    test('should return string value of string object key "collectionId"', () => {
      const configModule = rewire(`${BUILD_FOLDER}/methods/arg-parser`);
      const getArgValue = configModule.__get__('getArgValue');

      const expected = 'bayc';
      const actual = getArgValue(JSON.parse(inputArgvLongNames), ['--collectionId']);

      expect(actual).toEqual(expected);
    });
  });

  describe('parseConfigArgs', () => {
    test('should return ConfigArgs with with all args present', () => {
      const expected = {
        collectionId: 'bayc',
        collectionDisplayName: 'BAYC',
        tokenPrefix: 'bayc-',
        nftCanisterId: 'aaaaa-bbbbb-ccccc-ddddd-cai',
        creatorPrincipal: '11111-22222-33333-44444-55555-66666-77777-88888-99999-11111-222',
        namespace: 'com.bayc.ape',
        folderPath: './projects/bayc-csm/__temp',
        assetMappings: 'primary:ape*.png, preview:index.html, hidden:mystery-ape.gif',
        nftOwnerId: 'aaaaa-bbbbb-ccccc-ddddd-eeeee-fffff-ggggg-iiiii-jjjjj-kkkkk-lll',
        soulbound: 'true',
        nftQuantities: '5,5,5,5,1,1,1',
      };

      const actual = parseConfigArgs(JSON.parse(inputArgvShortNames));

      expect(actual).toMatchObject<ConfigArgs>(expected);
    });

    test('should return ConfigArgs with valid defaults', () => {
      const expected = {
        collectionId: 'bayc',
        collectionDisplayName: 'BAYC',
        tokenPrefix: 'bayc-',
        nftCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
        creatorPrincipal: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
        namespace: 'com.bayc.ape',
        folderPath: './projects/bayc-csm/__temp',
        assetMappings: 'primary:ape*.png, preview:index.html, hidden:mystery-ape.gif',

        // optional arguments

        // should default to nftCanisterId
        nftOwnerId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
        // should default to 'false'
        soulbound: 'false',
        // should default to ''
        nftQuantities: '',
      };

      const actual = parseConfigArgs(JSON.parse(inputArgvShortNamesOmitOptional));

      expect(actual).toMatchObject<ConfigArgs>(expected);
    });
  });

  describe('config', () => {
    test('should write config file', () => {
      // registerLogger((message: string) => {
      //   console.log(message);
      // });

      const args = JSON.parse(inputConfigArgs);
      const expected = path.join(args.folderPath, '..', '__staged', 'full_def.json');

      const actual = config(args);
      expect(actual).toEqual(expected);
    });
  });
});
