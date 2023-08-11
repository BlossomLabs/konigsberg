import { ChainToken } from "../../domain/model/ChainToken";
import { BridgeOperation, BridgeOperationInformation, BridgeOperationStatusError, BridgeOperationStatusSuccess, BridgeProvider, BridgeProviderInformation } from "../../domain/bridges/BridgeProvider";

export class MockBridgeProvider implements BridgeProvider {
    getAllPossibleOriginChainsToChain(destinationChainId: number, tokenAddress?: string | undefined): Promise<number[]> {
        throw new Error("Method not implemented.");
    }
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
            new ChainToken(10, "0x4200000000000000000000000000000000000042", "OP", 6, "https://s2.coinmarketcap.com/static/img/coins/64x64/11840.png"),
            new ChainToken(137, "0x0000000000000000000000000000000000001010", "MATIC", 18, "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"),
            new ChainToken(10, "0x4200000000000000000000000000000000000006", "WETH", 18, "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"),
            new ChainToken(10, "0x0000000000000000000000000000000000000000", "ETH", 18, "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png"),
            new ChainToken(42161, "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", "USDC", 6, "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"),
        ]
    }
    
}