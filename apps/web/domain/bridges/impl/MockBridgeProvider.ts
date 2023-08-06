import { ChainToken } from "../../tokens/ChainToken";
import { BridgeOperation, BridgeOperationInformation, BridgeOperationStatusError, BridgeOperationStatusSuccess, BridgeProvider, BridgeProviderInformation } from "../BridgeProvider";

export class MockBridgeProvider implements BridgeProvider {
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