import rewire from 'rewire';
import { parseConfigArgs } from '../methods/arg-parser';
import { ConfigArgs } from '../types/config';

const BUILD_FOLDER = '../../lib';

const inputArgvLongNames =
  '["node","projects/csm.js","config","--collectionId","bm","--displayName","Brain Matters","--description","A collection of 20 unique brain matters NFTs","--tokenPrefix","bm_","--nftCanisterId","rrkah-fqaaa-aaaaa-aaaaq-cai","--creatorPrincipal","6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe","--folderPath","./projects/simple-video/assets","--assetMappings","primary:mike.png, experience:Origynator_Card_Mike_Schwartz_Small.mp4, preview:index.html","--soulbound","false","--brokerRoyalty","0.05","--customRoyalty","0.02","--origynatorRoyalty","0.03","--nftQuantities","3"]';

describe('config module', () => {
  describe.skip('getArgValue', () => {
    test('should return string value of string object key "collectionId"', () => {
      const argParser = rewire(`${BUILD_FOLDER}/methods/arg-parser`);
      const getArgValue = argParser.__get__('getArgValue');

      const expected = 'bm';
      const actual = getArgValue(JSON.parse(inputArgvLongNames), ['--collectionId']);

      expect(actual).toEqual(expected);
    });
  });

  describe('parseConfigArgs', () => {
    test('should return ConfigArgs with with all args present', () => {
      const expected = {
        collectionId: 'bm',
        displayName: 'Brain Matters',
        description: 'A collection of 20 unique Brain Matters NFTs',
        tokenPrefix: 'bm-',
        tokenWords: '',
        minWords: '3',
        maxWords: '3',
        nftCanisterId: 'aaaaa-bbbbb-ccccc-ddddd-cai',
        creatorPrincipal: '11111-22222-33333-44444-55555-66666-77777-88888-99999-11111-222',
        folderPath: './projects/bm/__temp',
        assetMappings: 'primary:nft*.png, preview:index.html, hidden:mystery.gif',
        nftOwnerId: 'aaaaa-bbbbb-ccccc-ddddd-eeeee-fffff-ggggg-iiiii-jjjjj-kkkkk-lll',
        soulbound: 'true',
        nftQuantities: '5,5,5,5,1,1,1',
        originatorPrincipal: '11111-22222-33333-44444-55555-66666-77777-88888-99999-11111-222',
        nodePrincipal: 'a3lu7-uiaaa-aaaaj-aadnq-cai',
        networkPrincipal: 'a3lu7-uiaaa-aaaaj-aadnq-cai',
        primaryOriginatorRate: '0.01',
        primaryBrokerRate: '0.03',
        primaryNodeRate: '0.035',
        primaryNetworkRate: '0.005',
        primaryCustomRates: '',
        secondaryOriginatorRate: '0.01',
        secondaryBrokerRate: '0.03',
        secondaryNodeRate: '0.035',
        secondaryNetworkRate: '0.005',
        secondaryCustomRates: ''
      };

      const actual = parseConfigArgs(JSON.parse(inputArgvLongNames));

      expect(actual).toMatchObject<ConfigArgs>(expected);
    });

    // test.skip('should return ConfigArgs with valid defaults', () => {
    //   const expected : ConfigArgs = {
    //     collectionId: 'bm',
    //     displayName: 'Brain Matters',
    //     description: 'A collection of 20 unique Brain Matters NFTs',
    //     tokenPrefix: 'bm-',
    //     nftCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    //     creatorPrincipal: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
    //     folderPath: './projects/bm/__temp',
    //     assetMappings: 'primary:nft*.png, preview:index.html, hidden:mystery.gif',

    //     // optional arguments
    //     brokerRoyalty: '',
    //     customRoyalty: '',
    //     origynatorRoyalty: '',
    //     // should default to nftCanisterId
    //     nftOwnerId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
    //     // should default to 'false'
    //     soulbound: 'false',
    //     // should default to ''
    //     nftQuantities: '',
    //   };

    //   const actual = parseConfigArgs(JSON.parse(inputArgvShortNamesOmitOptional));

    //   expect(actual).toMatchObject<ConfigArgs>(expected);
    // });
  });

});
