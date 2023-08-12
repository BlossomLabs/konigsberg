import "@testing-library/jest-dom";
import { HopBridgeProvider } from "../../../../infrastructure/bridges/hop/HopBridgeProvider";
import { ChainToken } from "../../../../domain/model/ChainToken";

const hopBridgeProvider: HopBridgeProvider = new HopBridgeProvider();
const SECONDS = 1000;
describe("Hop sdk ", () => {
    // supported chains: 1, 10, 8453 and all are bridgeable among them
    // supported tokens: eth (null)
    
    it(
        "getAllPossibleOriginChainsToChain",
        async () => {
            /*******************************
             * request non supported info  *
             *******************************/ 
            // no supported chain, all tokens
            var noSupportedChainOrToken : number[] = await hopBridgeProvider.getAllPossibleOriginChainsToChain(56);
            expect(noSupportedChainOrToken).toEqual([]);
            // no supported chain, supported token
            noSupportedChainOrToken = await hopBridgeProvider.getAllPossibleOriginChainsToChain(56, null);
            expect(noSupportedChainOrToken).toEqual([]);
            // supported chain, no supported token
            noSupportedChainOrToken = await hopBridgeProvider.getAllPossibleOriginChainsToChain(1, "0x1")
            expect(noSupportedChainOrToken).toEqual([]);
            // no supported chain, no supported token
            noSupportedChainOrToken = await hopBridgeProvider.getAllPossibleOriginChainsToChain(45, "0x1")
            expect(noSupportedChainOrToken).toEqual([]);

            /***************************
             * request supported info  *
             ***************************/ 
            // chain 1
            var supportedChainAndToken : number[] = await hopBridgeProvider.getAllPossibleOriginChainsToChain(1);
            expect(supportedChainAndToken).toEqual([10,8453]);
            supportedChainAndToken = await hopBridgeProvider.getAllPossibleOriginChainsToChain(1, null);
            expect(supportedChainAndToken).toEqual([10,8453]);
            // chain 10
            var supportedChainAndToken : number[] = await hopBridgeProvider.getAllPossibleOriginChainsToChain(10);
            expect(supportedChainAndToken).toEqual([1,8453]);
            supportedChainAndToken = await hopBridgeProvider.getAllPossibleOriginChainsToChain(10, null);
            expect(supportedChainAndToken).toEqual([1,8453]);
            // chain 8453
            var supportedChainAndToken : number[] = await hopBridgeProvider.getAllPossibleOriginChainsToChain(8453);
            expect(supportedChainAndToken).toEqual([1,10]);
            supportedChainAndToken = await hopBridgeProvider.getAllPossibleOriginChainsToChain(8453, null);
            expect(supportedChainAndToken).toEqual([1,10]);
        },
        10 * SECONDS
    );

    it(
        "getAllBridgeableTokensToChain",
        async () => {
            /*******************************
             * request non supported info  *
             *******************************/ 
            // supported origin chain, non supported destination chain
            var noSupportedResult  : ChainToken[] = await hopBridgeProvider.getAllBridgeableTokensToChain(2, 1);
            expect(noSupportedResult).toEqual([]);
            // non supported origin chain, supported destination chain
            noSupportedResult = await hopBridgeProvider.getAllBridgeableTokensToChain(1, 2);
            expect(noSupportedResult).toEqual([]);
            // non supported origin chain, non supported destination chain
            noSupportedResult = await hopBridgeProvider.getAllBridgeableTokensToChain(2, 3);
            expect(noSupportedResult).toEqual([]);
            // any origin chain, supported destination chain
            noSupportedResult = await hopBridgeProvider.getAllBridgeableTokensToChain(2);
            expect(noSupportedResult).toEqual([]);

            /***************************
             * request supported info  *
             ***************************/ 
            // send to 1
            var supportedResult : ChainToken[] = await hopBridgeProvider.getAllBridgeableTokensToChain(1);
            console.log(supportedResult)
            expect(supportedResult.length).toEqual(2);
            expect(supportedResult[0].chainId).toEqual(10);
            expect(supportedResult[0].contractAddress).toBeNull();
            expect(supportedResult[0].symbol).toEqual("ETH");
            
            expect(supportedResult[1].chainId).toEqual(8453);
            expect(supportedResult[1].contractAddress).toBeNull();
            expect(supportedResult[1].symbol).toEqual("ETH");

            // send to 10
            supportedResult = await hopBridgeProvider.getAllBridgeableTokensToChain(10);
            expect(supportedResult.length).toEqual(2);
            expect(supportedResult[0].chainId).toEqual(1);
            expect(supportedResult[0].contractAddress).toBeNull();
            expect(supportedResult[0].symbol).toEqual("ETH");
            
            expect(supportedResult[1].chainId).toEqual(8453);
            expect(supportedResult[1].contractAddress).toBeNull();
            expect(supportedResult[1].symbol).toEqual("ETH");

            // send to 8453
            supportedResult = await hopBridgeProvider.getAllBridgeableTokensToChain(10);
            expect(supportedResult.length).toEqual(2);
            expect(supportedResult[0].chainId).toEqual(1);
            expect(supportedResult[0].contractAddress).toBeNull();
            expect(supportedResult[0].symbol).toEqual("ETH");
            
            expect(supportedResult[1].chainId).toEqual(8453);
            expect(supportedResult[1].contractAddress).toBeNull();
            expect(supportedResult[1].symbol).toEqual("ETH");
        },
        10 * SECONDS
    );
    it("getBridgeProviderQuoteInformation",
    async () => {
        const testRecipient = "0x0000000000000000000000000000000000000000"
        const quoteInfo = await hopBridgeProvider.getBridgeProviderQuoteInformation(1, null, 10, BigInt(20000), 0.5, testRecipient);
        expect(quoteInfo?.contractAddress).toEqual("0xb8901acB165ed027E32754E0FFe830802919727f")
        expect(quoteInfo!.estimatedAmount.valueOf() + quoteInfo!.estimatedFee.valueOf()).toEqual(quoteInfo?.transactionValue)
    }, 10*SECONDS)
});
