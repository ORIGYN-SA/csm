import { parseConfigArgs, getArgValue } from '../methods/arg-parser';
import { ConfigArgs } from '../types/config';

const inputArgvLongNames =
  '["node","projects/csm.js","config","--collectionId","bm","--displayName","Brain Matters Collection","--description","A collection of 20 unique brain matters NFTs","--tokenPrefix","bm_","--nftCanisterId","rrkah-fqaaa-aaaaa-aaaaq-cai","--creatorPrincipal","6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe","--folderPath","./projects/simple-video/assets","--assetMappings","primary:mike.png, experience:Origynator_Card_Mike_Schwartz_Small.mp4, preview:index.html","--soulbound","false","--brokerRoyalty","0.05","--customRoyalty","0.02","--origynatorRoyalty","0.03","--nftQuantities","3"]';

describe('config module', () => {
  describe('getArgValue', () => {
    test('should return string value of string object key "collectionId"', () => {
      const expected = 'bm';
      const actual = getArgValue(JSON.parse(inputArgvLongNames), ['--collectionId']);

      expect(actual).toEqual(expected);
    });
  });

  describe('parseConfigArgs', () => {
    test('should return ConfigArgs with with all args present', () => {
      const expected = {
        collectionId: 'bm',
        displayName: 'Brain Matters Collection',
        description: 'A collection of 20 unique brain matters NFTs',
        tokenPrefix: 'bm_',
        tokenWords: '',
        minWords: '3',
        maxWords: '3',
        nftCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
        creatorPrincipal: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
        folderPath: './projects/simple-video/assets',
        assetMappings: 'primary:mike.png, experience:Origynator_Card_Mike_Schwartz_Small.mp4, preview:index.html',
        nftOwnerId: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
        soulbound: 'false',
        nftQuantities: '3',
        originatorPrincipal: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
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
  });

});
