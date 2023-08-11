import { ChainToken } from "../../../domain/model/ChainToken";
import {
    BridgeOperation,
    BridgeOperationInformation,
    BridgeOperationStatusError,
    BridgeProvider,
    BridgeProviderInformation,
} from "../../../domain/bridges/BridgeProvider";
import { CelerApi } from "./api/celerApi";
import { CelerApiTransferConfigResponse } from "./api/responses/CelerApiTransferConfigResponse";
import { CelerApiPeggedPairConfig } from "./api/models/CelerApiPeggedPairConfig";

// // import getTransferConfig request message
// import { GetTransferConfigsRequest, GetTransferConfigsResponse } from "./sdk/ts-proto/gateway/gateway_pb";
// // import grpc-web WebClient
// import { WebClient } from "./sdk/ts-proto/gateway/GatewayServiceClientPb";

export class CelerBridgeProvider implements BridgeProvider {
    // cBridgeTestnetEndpoint = "https://cbridge-v2-test.celer.network/v1/";
    // cBridgeEndpoint = "https://cbridge-prod2.celer.app/v1/";
    private api : CelerApi = new CelerApi();
    private cachedTransferConfigResponse : CelerApiTransferConfigResponse|undefined

    getBridgeProviderInformation(): BridgeProviderInformation {
        return new BridgeProviderInformation("cBridge", "Celer Bridge");
    }

    protected async getTransferConfigs() : Promise<CelerApiTransferConfigResponse|undefined> {
        if(!this.cachedTransferConfigResponse){
            this.cachedTransferConfigResponse = await this.api.Bridge.getTransferConfigs();
        }
        return this.cachedTransferConfigResponse;

    }

    async getAllPossibleOriginChainsToChain(
        destinationChainId: number,
        tokenAddress?: string | undefined
    ): Promise<number[]> {
        const config = await this.getTransferConfigs();
        const peggedPairConfig : CelerApiPeggedPairConfig[] | undefined = config?.pegged_pair_configs;
        if(!peggedPairConfig)
            return [];

        return peggedPairConfig.filter(e => {
            if(tokenAddress == undefined)
                return e.pegged_chain_id == destinationChainId;
            return e.pegged_chain_id == destinationChainId && tokenAddress == e.pegged_token?.token.address;
        }).map((e)=> e.org_chain_id);
    }
    
    async getAllBridgeableTokensToChain(destinationChainId: number, originChainId?: number): Promise<ChainToken[]> {
        const config = await this.getTransferConfigs();
        const peggedPairConfig : CelerApiPeggedPairConfig[] | undefined = config?.pegged_pair_configs;
        if(!peggedPairConfig)
            return [];

        return peggedPairConfig.filter(e => {
            if(originChainId == undefined)
                return e.pegged_chain_id == destinationChainId;
            return e.pegged_chain_id == destinationChainId && originChainId == e.org_chain_id;
        }).flatMap((e)=> {
            if(e.org_token == undefined)
                return [];
            const chain : ChainToken = new ChainToken(e.org_chain_id, e.org_token.token.address, e.org_token?.token.symbol, e.org_token?.token.decimal, e.org_token?.icon)
            return chain;
        });
    }

    async bridgeTokens(
        sourceWalletId: string,
        sourceChainId: number,
        sourceTokenId: string,
        destinationWalletId: string,
        destinationChainId: number,
        quantity: BigInt
    ): Promise<BridgeOperation> {
        // TODO: implement for lifi
        return new BridgeOperation(
            "0",
            new BridgeOperationStatusError("ERR_NOT_IMPL", "Bridge provider not implemented")
        );
    }
    async getBridgeProviderQuoteInformation(
        sourceWalletId: string,
        sourceChainId: number,
        sourceTokenId: string,
        destinationChainId: number,
        quantity: BigInt
    ): Promise<BridgeOperationInformation> {
        // TODO: implement for lifi
        return new BridgeOperationInformation(BigInt(0), BigInt(0));
    }
}
