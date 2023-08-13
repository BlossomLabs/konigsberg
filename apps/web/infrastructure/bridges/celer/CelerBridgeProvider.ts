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
import { ethers } from "ethers";

// // import getTransferConfig request message
// import { GetTransferConfigsRequest, GetTransferConfigsResponse } from "./sdk/ts-proto/gateway/gateway_pb";
// // import grpc-web WebClient
// import { WebClient } from "./sdk/ts-proto/gateway/GatewayServiceClientPb";

export class CelerBridgeProvider implements BridgeProvider {
    getUrlForTransactionHash(hash: string): string | undefined {
        return "https://celerscan.com/tx/" + hash;
    }
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

    // async getAllPossibleOriginChainsToChain(
    //     destinationChainId: number,
    //     tokenAddress?: string | undefined
    // ): Promise<number[]> {
    //     const config = await this.getTransferConfigs();
    //     const peggedPairConfig : CelerApiPeggedPairConfig[] | undefined = config?.pegged_pair_configs;
    //     if(!peggedPairConfig)
    //         return [];

    //     return peggedPairConfig.filter(e => {
    //         if(tokenAddress == undefined)
    //             return e.pegged_chain_id == destinationChainId;
    //         return e.pegged_chain_id == destinationChainId && tokenAddress == e.pegged_token?.token.address;
    //     }).map((e)=> e.org_chain_id);
    // }

    async getAllPossibleOriginChainsToChain(
        destinationChainId: number,
        tokenAddress?: string | null
    ): Promise<number[]> {

        if (destinationChainId === 1 && tokenAddress === null) {
            return [10];
        } else if (destinationChainId === 10 && tokenAddress === null) {
            return [1];
        }

        return [];
    }
    
    // async getAllBridgeableTokensToChain(destinationChainId: number, originChainId?: number): Promise<ChainToken[]> {
    //     const config = await this.getTransferConfigs();
    //     const peggedPairConfig : CelerApiPeggedPairConfig[] | undefined = config?.pegged_pair_configs;
    //     if(!peggedPairConfig)
    //         return [];

    //     return peggedPairConfig.filter(e => {
    //         if(originChainId == undefined)
    //             return e.pegged_chain_id == destinationChainId;
    //         return e.pegged_chain_id == destinationChainId && originChainId == e.org_chain_id;
    //     }).flatMap((e)=> {
    //         if(e.org_token == undefined)
    //             return [];
    //         const chain : ChainToken = new ChainToken(e.org_chain_id, e.org_token.token.address, e.org_token?.token.symbol, e.org_token?.token.decimal, e.org_token?.icon)
    //         return chain;
    //     });
    // }
    async getAllBridgeableTokensToChain(destinationChainId: number, originChainId?: number): Promise<ChainToken[]> {
        if ((originChainId === undefined || originChainId === 1) && destinationChainId === 10) {
            return [
                new ChainToken(1, null, 'ETH', 18, 'https://get.celer.app/cbridge-icons/chain-icon/ETH.png')
            ]
        } else if ((originChainId === undefined || originChainId === 10) && destinationChainId === 1) {
            return [
                new ChainToken(10, null, 'ETH', 18, 'https://get.celer.app/cbridge-icons/chain-icon/ETH.png')
            ]
        }
        return [];
    }

    async getBridgeProviderQuoteInformation(
        sourceChainId: number,
        sourceTokenAddress: string,
        destinationChainId: number,
        quantity: BigInt,
        slippage: number,
        recipientAddress: string
    ): Promise<BridgeOperationInformation|undefined> {

        if (sourceTokenAddress !== null) return undefined;
    
        const data = this.prepareTransactionData(
            recipientAddress,
            quantity,
            destinationChainId,
            slippage
        );

        if (sourceChainId === 1 && destinationChainId === 10) {
            return new BridgeOperationInformation(
                quantity,
                '0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820',
                data,
                quantity,
                BigInt(0), // TODO: get from API
                Date.now() / 1000 + 3 * 60, // TODO: get from API
            );
        } else if (sourceChainId === 10 && destinationChainId === 1) {
            return new BridgeOperationInformation(
                quantity,
                '0x9d39fc627a6d9d9f8c831c16995b209548cc3401',
                data,
                quantity,
                BigInt(0), // TODO: get from API
                Date.now() / 1000 + 3 * 60, // TODO: get from API
            );
        }
        return undefined;
    }

    
    private prepareTransactionData(
        recipientAddress: string,
        quantity: BigInt,
        destinationChainId: number,
        slippage: number
    ): any {
        const iface = new ethers.utils.Interface([
            "function sendNative(address _receiver, uint256 _amount, uint64 _dstChainId, uint64 _nonce, uint32 _maxSlippage)",
        ]);
        let data = iface.encodeFunctionData("sendNative", [
            recipientAddress,
            quantity.toString(),
            destinationChainId,
            Date.now(),
            31506// TODO: use slippage
        ]);

        return data;
    }
}
