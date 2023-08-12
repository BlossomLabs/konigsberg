import {
    BridgeOperationInformation,
    BridgeProvider,
    BridgeProviderInformation,
} from "../../../domain/bridges/BridgeProvider";
import { ChainToken } from "../../../domain/model/ChainToken";

export class Mock2BridgeProvider implements BridgeProvider {
    allowedChains = [1, 10, 8564];
    async getBridgeProviderQuoteInformation(
        sourceChainId: number,
        sourceTokenAddress: string | null,
        destinationChainId: number,
        quantity: BigInt,
        slippage: number,
        recipientAddress: string
    ): Promise<BridgeOperationInformation | undefined> {
        if (sourceTokenAddress != null) return undefined; // only supporting eth

        if (!this.allowedChains.includes(sourceChainId) || !this.allowedChains.includes(destinationChainId)){
            console.log("not in allowed chains")
            return undefined; // not supporting one of the chains
        }

        const prefix = "mock2Chain" + sourceChainId;
        if (sourceChainId == 1) {
            // best terms from eth (amount), worst for time
            const fee = 20;
            return new BridgeOperationInformation(
                quantity.valueOf() - BigInt(fee),
                prefix + "Address",
                prefix + "TransactionData",
                quantity,
                BigInt(fee),
                1691891884
            );
        }
        // bad terms on the rest (amount), best for time
        const fee = 30;
        return new BridgeOperationInformation(
            quantity.valueOf() - BigInt(fee),
            prefix + "Address",
            prefix + "TransactionData",
            quantity,
            BigInt(fee),
            1691861884
        );
    }
    getBridgeProviderInformation(): BridgeProviderInformation {
        return new BridgeProviderInformation("mock2", "Mock Bridge 2");
    }
    async getAllBridgeableTokensToChain(
        destinationChainId: number,
        originChainId?: number | undefined
    ): Promise<ChainToken[]> {
        var originChains: number[] = [];
        if (originChainId != undefined) {
            if (originChainId != 1 && originChainId != 10 && originChainId != 8564) return [];
            originChains = [originChainId];
        } else {
            if (destinationChainId == 1) originChains = [10, 8564];
            if (destinationChainId == 10) originChains = [1, 8564];
            if (destinationChainId == 8564) originChains = [1, 10];
        }
        return originChains.map(
            (d) => new ChainToken(d, null, "ETH", 18, "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png")
        );
    }
    async getAllPossibleOriginChainsToChain(
        destinationChainId: number,
        tokenAddress?: string | null | undefined
    ): Promise<number[]> {
        // case we are asking for no eth
        if (tokenAddress != undefined && tokenAddress != null) return [];

        if (destinationChainId == 1) return [10, 8564];
        if (destinationChainId == 10) return [1, 8564];
        if (destinationChainId == 8564) return [1, 10];

        return [];
    }
}
