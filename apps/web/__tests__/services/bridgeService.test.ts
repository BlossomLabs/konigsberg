
import '@testing-library/jest-dom';
import { BestBridgeProviderType, BridgeService } from '../../services/bridgeService';
import { MockBridgeProvider } from '../../infrastructure/bridges/mocks/MockBridgeProvider';
import { Mock1BridgeProvider } from '../../infrastructure/bridges/mocks/Mock1BridgeProvider';
import { Mock2BridgeProvider } from '../../infrastructure/bridges/mocks/Mock2BridgeProvider';
import { BridgeProvider } from '../../domain/bridges/BridgeProvider';


const mockBridgeService : BridgeService = new BridgeService([new Mock1BridgeProvider(), new Mock2BridgeProvider()]);

describe('Bridge Service', () => {
    it('gets all bridgeable tokens from chain', async () => {
        const testChainId = 10; // Optimism
        const result = await mockBridgeService.getAllBridgeableTokensToChain(testChainId, undefined);
        
        expect(result.length).toEqual(2); // from mainnet and base

        // mainnet
        expect(result[0].chainId).toEqual(1);
        expect(result[0].contractAddress).toBeNull();
        expect(result[0].nDecimals).toEqual(18);
        expect(result[0].symbol).toEqual("ETH");
        // base
        expect(result[1].chainId).toEqual(8453);
        expect(result[1].contractAddress).toBeNull();
        expect(result[1].nDecimals).toEqual(18);
        expect(result[1].symbol).toEqual("ETH");
    });
    it('getCompatibleOriginChains', async () => {
        // for destination mainnet, both optimism and base (only for eth)
        var result : number[] = await mockBridgeService.getCompatibleOriginChains(1, null);
        expect(result).toEqual([10, 8453])
        result = await mockBridgeService.getCompatibleOriginChains(1, "0x4200000000000000000000000000000000000042"); // OP
        expect(result).toEqual([])

        // for destination optimism, both mainnet and base
        result = await mockBridgeService.getCompatibleOriginChains(10, null);
        expect(result).toEqual([1, 8453])
        result = await mockBridgeService.getCompatibleOriginChains(10, "0x4200000000000000000000000000000000000042"); // OP
        expect(result).toEqual([])
        // for destination base, both mainnet and optimism
        result = await mockBridgeService.getCompatibleOriginChains(8453, null);
        expect(result).toEqual([1, 10])
        result = await mockBridgeService.getCompatibleOriginChains(8453, "0x4200000000000000000000000000000000000042"); // OP
        expect(result).toEqual([])

        // for destination random, none
        result = await mockBridgeService.getCompatibleOriginChains(123, null);
        expect(result).toEqual([])
        result = await mockBridgeService.getCompatibleOriginChains(123, "0x4200000000000000000000000000000000000042"); // OP
        expect(result).toEqual([])

    });
    it('getBestBridgeProviderForBridging', async () => {
        // in our test, bridge1 supports chains 1 and 10
        // best time from mainnet and best amount from others

        // bridge 2 supports chains 1, 10 and 8453
        // best amount from mainnet and best time from others

        /*********************************
        * both providers have the chains *
        **********************************/
        var result : BridgeProvider | undefined = await mockBridgeService.getBestBridgeProviderForBridging(
            1,
            null,
            10,
            BigInt(4000),
            0.5,
            "0x0000000000000000000000000000000000000000",
            BestBridgeProviderType.BEST_RETURN
        );
        expect(result?.getBridgeProviderInformation().id).toEqual("mock2");
        result = await mockBridgeService.getBestBridgeProviderForBridging(
            1,
            null,
            10,
            BigInt(4000),
            0.5,
            "0x0000000000000000000000000000000000000000",
            BestBridgeProviderType.BEST_TIME
        );
        expect(result?.getBridgeProviderInformation().id).toEqual("mock_1");
        result = await mockBridgeService.getBestBridgeProviderForBridging(
            10,
            null,
            1,
            BigInt(4000),
            0.5,
            "0x0000000000000000000000000000000000000000",
            BestBridgeProviderType.BEST_RETURN
        );
        expect(result?.getBridgeProviderInformation().id).toEqual("mock_1");
        result = await mockBridgeService.getBestBridgeProviderForBridging(
            10,
            null,
            1,
            BigInt(4000),
            0.5,
            "0x0000000000000000000000000000000000000000",
            BestBridgeProviderType.BEST_TIME
        );
        expect(result?.getBridgeProviderInformation().id).toEqual("mock2");

        /*****************************
        * only mock2 has both chains *
        ******************************/
       result =  await mockBridgeService.getBestBridgeProviderForBridging(
            1,
            null,
            8453,
            BigInt(4000),
            0.5,
            "0x0000000000000000000000000000000000000000",
            BestBridgeProviderType.BEST_RETURN
        );
        expect(result?.getBridgeProviderInformation().id).toEqual("mock2");
        result = await mockBridgeService.getBestBridgeProviderForBridging(
            1,
            null,
            8453,
            BigInt(4000),
            0.5,
            "0x0000000000000000000000000000000000000000",
            BestBridgeProviderType.BEST_TIME
        );
        expect(result?.getBridgeProviderInformation().id).toEqual("mock2");
        result = await mockBridgeService.getBestBridgeProviderForBridging(
            8453,
            null,
            1,
            BigInt(4000),
            0.5,
            "0x0000000000000000000000000000000000000000",
            BestBridgeProviderType.BEST_RETURN
        );
        expect(result?.getBridgeProviderInformation().id).toEqual("mock2");
        result = await mockBridgeService.getBestBridgeProviderForBridging(
            8453,
            null,
            1,
            BigInt(4000),
            0.5,
            "0x0000000000000000000000000000000000000000",
            BestBridgeProviderType.BEST_TIME
        );
        expect(result?.getBridgeProviderInformation().id).toEqual("mock2");

        /*******************************
        * neither mocks have one chain *
        ********************************/
        result =  await mockBridgeService.getBestBridgeProviderForBridging(
            2,
            null,
            8453,
            BigInt(4000),
            0.5,
            "0x0000000000000000000000000000000000000000",
            BestBridgeProviderType.BEST_RETURN
        );
        expect(result).toBeUndefined();
        result = await mockBridgeService.getBestBridgeProviderForBridging(
            2,
            null,
            8453,
            BigInt(4000),
            0.5,
            "0x0000000000000000000000000000000000000000",
            BestBridgeProviderType.BEST_TIME
        );
        expect(result).toBeUndefined();
        result = await mockBridgeService.getBestBridgeProviderForBridging(
            8453,
            null,
            2,
            BigInt(4000),
            0.5,
            "0x0000000000000000000000000000000000000000",
            BestBridgeProviderType.BEST_RETURN
        );
        expect(result).toBeUndefined();
        result = await mockBridgeService.getBestBridgeProviderForBridging(
            8453,
            null,
            2,
            BigInt(4000),
            0.5,
            "0x0000000000000000000000000000000000000000",
            BestBridgeProviderType.BEST_TIME
        );
        expect(result).toBeUndefined();
    });
  });