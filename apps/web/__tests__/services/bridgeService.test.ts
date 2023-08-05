
import '@testing-library/jest-dom';
import { BridgeService } from '../../services/bridgeService';
import { BridgeOperation, BridgeOperationInformation, BridgeOperationStatusSuccess, BridgeProvider, BridgeProviderInformation } from '../../domain/bridges/BridgeProvider';
import { ChainToken } from '../../domain/tokens/ChainToken';


class MockBridgeProvider implements BridgeProvider {
    async bridgeTokens(sourceWalletId: number, sourceChainId: number, sourceTokenId: number, destinationWalletId: number, destinationChainId: number, quantity: number): Promise<BridgeOperation> {
        return new BridgeOperation(127, new BridgeOperationStatusSuccess());
    }
    async getBridgeProviderQuoteInformation(sourceWalletId: number, sourceChainId: number, sourceTokenId: number, destinationChainId: number, quantity: number): Promise<BridgeOperationInformation> {
        return new BridgeOperationInformation(10,5);
    }
    getBridgeProviderInformation(): BridgeProviderInformation {
        return new BridgeProviderInformation("test_bridge_id", "TestBridgeId");
    }
    async getAllBridgeableTokensFromChain(chainId: number): Promise<ChainToken[]> {
        return [new ChainToken(10, 0x7F5c764cBc14f9669B88837ca1490cCa17c31607, "USDC", 6)]
    }
    
}

class MockBridgeService extends BridgeService {
    // hardcoded values accessor
    protected getAllBridgeProviders = (): BridgeProvider[] => {
        return [new MockBridgeProvider()]
    };
}

const mockBridgeService : MockBridgeService = new MockBridgeService();

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