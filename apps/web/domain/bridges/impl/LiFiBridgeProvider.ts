import { ChainToken } from "../../tokens/ChainToken";
import { BridgeOperation, BridgeOperationInformation, BridgeOperationStatusError, BridgeProvider, BridgeProviderInformation } from "../BridgeProvider";

export class LiFiBridgeProvider implements BridgeProvider {
    async bridgeTokens(sourceWalletId: number, sourceChainId: number, sourceTokenId: number, destinationWalletId: number, destinationChainId: number, quantity: number): Promise<BridgeOperation> {
        // TODO: implement for lifi
        return new BridgeOperation(0, new BridgeOperationStatusError("ERR_NOT_IMPL", "Bridge provider not implemented"));
    }
    async getBridgeProviderQuoteInformation(sourceWalletId: number, sourceChainId: number, sourceTokenId: number, destinationChainId: number, quantity: number): Promise<BridgeOperationInformation> {
        // TODO: implement for lifi
        return new BridgeOperationInformation(0, 0);
    }
    getBridgeProviderInformation(): BridgeProviderInformation {
        // TODO: implement for lifi
        return new BridgeProviderInformation("lifi", "lifi");
    }

    async getAllBridgeableTokensFromChain(chainId: number): Promise<ChainToken[]> {
        // TODO: implement for lifi
        return [];
    }
    
}