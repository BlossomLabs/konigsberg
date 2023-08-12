import "@testing-library/jest-dom";
import { ZoraBridgeProvider } from "../../../../infrastructure/bridges/zora/ZoraBridgeProvider";
import { ChainToken } from "../../../../domain/model/ChainToken";

const zoraBridgeProvider: ZoraBridgeProvider = new ZoraBridgeProvider();
const SECONDS = 1000;
describe("Zora bridge ", () => {
    // supported chains: mainnet to zora
    // supported tokens: eth (null)
    
    it(
        "getAllPossibleOriginChainsToChain",
        async () => {
            var chains = await zoraBridgeProvider.getAllPossibleOriginChainsToChain(7777777, null);
            expect(chains.length).toEqual(1);
            expect(chains[0]).toEqual(1);

            chains = await zoraBridgeProvider.getAllPossibleOriginChainsToChain(7777777, undefined);
            expect(chains.length).toEqual(1);
            expect(chains[0]).toEqual(1);

            chains = await zoraBridgeProvider.getAllPossibleOriginChainsToChain(7777777, '0x1a0ad011913A150f69f6A19DF447A0CfD9551054');
            expect(chains.length).toEqual(0);

            chains = await zoraBridgeProvider.getAllPossibleOriginChainsToChain(1, undefined);
            expect(chains.length).toEqual(0);
        },
        10 * SECONDS
    );

    it(
        "getAllBridgeableTokensToChain",
        async () => {
            var tokens = await zoraBridgeProvider.getAllBridgeableTokensToChain(7777777, 1);
            expect(tokens.length).toEqual(1);
            expect(tokens[0]).toEqual(new ChainToken(1, null, 'ETH', 18, 'https://get.celer.app/cbridge-icons/chain-icon/ETH.png'));

            tokens = await zoraBridgeProvider.getAllBridgeableTokensToChain(7777777, 10);
            expect(tokens.length).toEqual(0);

            tokens = await zoraBridgeProvider.getAllBridgeableTokensToChain(10, 1);
            expect(tokens.length).toEqual(0);

            tokens = await zoraBridgeProvider.getAllBridgeableTokensToChain(7777777, undefined);
            expect(tokens.length).toEqual(1);
            expect(tokens[0]).toEqual(new ChainToken(1, null, 'ETH', 18, 'https://get.celer.app/cbridge-icons/chain-icon/ETH.png'));

            tokens = await zoraBridgeProvider.getAllBridgeableTokensToChain(1, 7777777);
            expect(tokens.length).toEqual(0);

            tokens = await zoraBridgeProvider.getAllBridgeableTokensToChain(7777777, 7777777);
            expect(tokens.length).toEqual(0);
        },
        10 * SECONDS
    );

    it("getBridgeProviderQuoteInformation",
    async () => {
        var quoteInfo = await zoraBridgeProvider.getBridgeProviderQuoteInformation(1, null, 7777777, BigInt(1e18), 0, '0x0000000000000000000000000000000000000000');
        
        expect(quoteInfo.estimatedAmount).toEqual(BigInt(1e18));
        expect(quoteInfo.estimatedFee).toEqual(BigInt(0));
        expect(quoteInfo.contractAddress).toEqual('0x1a0ad011913A150f69f6A19DF447A0CfD9551054');
        expect(quoteInfo.transactionData).toEqual('0xe9e05c4200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000186a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000');
        expect(quoteInfo.transactionValue).toEqual(BigInt(1e18));
        expect(quoteInfo.estimatedDate).toBeGreaterThan(Date.now() / 1000);
    }, 10*SECONDS)
});
