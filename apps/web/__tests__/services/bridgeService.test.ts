
import '@testing-library/jest-dom';
import { BridgeService } from '../../services/bridgeService';
import { MockBridgeProvider } from '../../infrastructure/bridges/MockBridgeProvider';


const mockBridgeService : BridgeService = new BridgeService([new MockBridgeProvider()]);

describe('Bridge Service', () => {
    it('gets all bridgeable tokens from chain', async () => {
        const testChainId = 10; // Optimism
        const result = await mockBridgeService.getAllBridgeableTokensToChain(testChainId, undefined);
        expect(result.length).toBe(3);
        expect(result[0].chainId).toBe(10);
        expect(result[0].contractAddress).toBe("0x4200000000000000000000000000000000000042");
        expect(result[0].nDecimals).toBe(6);
        expect(result[0].symbol).toBe("OP");
    })
  });