import {
    BridgeOperationInformation,
    BridgeProvider,
    BridgeProviderInformation,
} from "../../../domain/bridges/BridgeProvider";
import { ChainToken } from "../../../domain/model/ChainToken";

export class Mock1BridgeProvider implements BridgeProvider {
    getUrlForTransactionHash(hash: string): string | undefined {
        throw new Error("Method not implemented.");
    }
    allowedChains = [1, 10];
    async getBridgeProviderQuoteInformation(
        sourceChainId: number,
        sourceTokenAddress: string | null,
        destinationChainId: number,
        quantity: BigInt,
        slippage: number,
        recipientAddress: string
    ): Promise<BridgeOperationInformation | undefined> {
        if (sourceTokenAddress != null) return undefined; // only supporting eth

        if (!this.allowedChains.includes(sourceChainId) || !this.allowedChains.includes(destinationChainId))
            return undefined; // not supporting one of the chains

        const prefix = "mock1Chain" + sourceChainId;
        if (sourceChainId == 1) {
            // worst terms from eth (amount), best terms for time
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
        // best terms on the rest (amount), worst terms for time
        const fee = 10;
        return new BridgeOperationInformation(
            quantity.valueOf() - BigInt(fee),
            prefix + "Address",
            prefix + "TransactionData",
            quantity,
            BigInt(fee),
            1691881884
        );
    }
    getBridgeProviderInformation(): BridgeProviderInformation {
        return new BridgeProviderInformation("mock_1", "Mock Bridge 1");
    }
    async getAllBridgeableTokensToChain(
        destinationChainId: number,
        originChainId?: number | undefined
    ): Promise<ChainToken[]> {
        var originChains: number[] = [];
        if (originChainId != undefined) {
            if (originChainId != 1 && originChainId != 10) return [];
            originChains = [originChainId];
        } else {
            if (destinationChainId == 1) originChains = [10];
            if (destinationChainId == 10) originChains = [1];
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

        if (destinationChainId == 1) return [10];
        if (destinationChainId == 10) return [1];

        return [];
    }
}
