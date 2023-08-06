
import '@testing-library/jest-dom';
import { BridgeService } from '../../services/bridgeService';
import { MockBridgeProvider } from '../../domain/bridges/impl/MockBridgeProvider';


const mockBridgeService : BridgeService = new BridgeService([new MockBridgeProvider()]);

describe('Bridge Service', () => {
    it('gets all bridgeable tokens from chain', async () => {
        const testChainId = 10; // Optimism
        const result = await mockBridgeService.getAllBridgeableTokensFromChain(testChainId);
        expect(result.length).toBe(1);
        expect(result[0].chainId).toBe(10);
        expect(result[0].contractId).toBe(0x7F5c764cBc14f9669B88837ca1490cCa17c31607);
        expect(result[0].nDecimals).toBe(6);
        expect(result[0].symbol).toBe("USDC");
    })
  });