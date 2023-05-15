import { parseConfigArgs, getArgValue } from '../methods/arg-parser';
import { ConfigArgs } from '../types/config';

const inputArgvLongNames =
  '["node","projects/csm.js","config","--collectionId","bm","--displayName","Brain Matters Collection","--description","A collection of 20 unique brain matters NFTs","--nftCanisterId","rrkah-fqaaa-aaaaa-aaaaq-cai","--creatorPrincipal","6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe","--folderPath","./projects/simple-video/assets","--assetMappings","primary:mike.png, experience:Origynator_Card_Mike_Schwartz_Small.mp4, preview:index.html","--soulbound","false","--brokerRoyalty","0.05","--customRoyalty","0.02","--origynatorRoyalty","0.03","--nftQuantities","3","--socials","twitter:https%3A%2F%2Ftwitter.com%2FYumiMarketplace, dscvr:https%3A%2F%2Fh5aet-waaaa-aaaab-qaamq-cai.raw.ic0.app%2Fu%2Fyumi_marketplace"]';

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
        nftCanisterId: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
        creatorPrincipal: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
        folderPath: './projects/simple-video/assets',
        assetMappings: 'primary:mike.png, experience:Origynator_Card_Mike_Schwartz_Small.mp4, preview:index.html',
        nftOwnerId: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
        soulbound: 'false',
        nftQuantities: '3',
        socials:
          'twitter:https%3A%2F%2Ftwitter.com%2FYumiMarketplace, dscvr:https%3A%2F%2Fh5aet-waaaa-aaaab-qaamq-cai.raw.ic0.app%2Fu%2Fyumi_marketplace',

        nodePrincipal: 'a3lu7-uiaaa-aaaaj-aadnq-cai',
        originatorPrincipal: '6i6da-t3dfv-vteyg-v5agl-tpgrm-63p4y-t5nmm-gi7nl-o72zu-jd3sc-7qe',
        networkPrincipal: 'a3lu7-uiaaa-aaaaj-aadnq-cai',

        primaryBrokerRate: '0.03',
        primaryNodeRate: '0.035',
        primaryOriginatorRate: '0.01',
        primaryNetworkRate: '0.005',

        secondaryBrokerRate: '0.03',
        secondaryNodeRate: '0.035',
        secondaryOriginatorRate: '0.01',
        secondaryNetworkRate: '0.005',

        primaryCustomRates: '',
        secondaryCustomRates: '',
      };

      const actual = parseConfigArgs(JSON.parse(inputArgvLongNames));

      expect(actual).toMatchObject<ConfigArgs>(expected);
    });
  });
});
