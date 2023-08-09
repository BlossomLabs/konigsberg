import { ChainToken } from "../../tokens/ChainToken";
import { BridgeOperation, BridgeOperationInformation, BridgeOperationStatusError, BridgeOperationStatusSuccess, BridgeProvider, BridgeProviderInformation } from "../BridgeProvider";

export class MockBridgeProvider implements BridgeProvider {
    async bridgeTokens(sourceWalletAddress: string, sourceChainId: number, sourceTokenAddress: string, destinationWalletAddress: string, destinationChainId: number, quantity: BigInt): Promise<BridgeOperation> {
        return new BridgeOperation("0x127", new BridgeOperationStatusSuccess());
    }
    async getBridgeProviderQuoteInformation(sourceWalletAddress: string, sourceChainId: number, sourceTokenAddress: string, destinationChainId: number, quantity: BigInt): Promise<BridgeOperationInformation> {
        return new BridgeOperationInformation(BigInt(10),BigInt(5));
    }
    getBridgeProviderInformation(): BridgeProviderInformation {
        return new BridgeProviderInformation("test_bridge_id", "TestBridgeId");
    }
    async getAllBridgeableTokensFromChain(chainId: number): Promise<ChainToken[]> {
        return [
            new ChainToken(10, "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", "USDC", 6),
        ]
    }
    
}