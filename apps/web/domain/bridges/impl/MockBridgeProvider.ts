import { ChainToken } from "../../model/ChainToken";
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
    async getAllBridgeableTokensToChain(destinationChainId: number, originChainId?: number): Promise<ChainToken[]> {
        return [
            new ChainToken(10, "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "USDC", 6),
            new ChainToken(10, "0xdac17f958d2ee523a2206206994597c13d831ec7", "USDT", 6),
            new ChainToken(10, "0x6b175474e89094c44da98b954eedeac495271d0f", "DAI", 6),
            new ChainToken(10, "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", "WBTC", 8),
        ]
    }
    
}