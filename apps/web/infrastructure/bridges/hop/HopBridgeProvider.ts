import { ethers } from "ethers";
import {
    BridgeOperation,
    BridgeOperationInformation,
    BridgeProvider,
    BridgeProviderInformation,
} from "../../../domain/bridges/BridgeProvider";
import { ChainToken } from "../../../domain/model/ChainToken";
import { HopConfig } from "./config/HopConfig";
import hopConfigJson from "./config/hopConfig.json";
import { HopApi } from "./api/hopApi";
import { HopApiQuoteResponse } from "./api/request_response/HopApiQuoteResponse";

export class HopBridgeProvider implements BridgeProvider {
    private api: HopApi = new HopApi();

    async getBridgeProviderQuoteInformation(
        sourceChainId: number,
        sourceTokenAddress: string | null,
        destinationChainId: number,
        quantity: BigInt,
        slippage: number,
        recipientAddress: string
    ): Promise<BridgeOperationInformation | undefined> {
        const hopConfig: HopConfig = hopConfigJson;

        try {
            const sourceChainName = hopConfigJson.chainsInfo.find((c) => c.chainId == sourceChainId)?.chainName;
            if (sourceChainName == undefined) return undefined;

            const destinationChainName = hopConfigJson.chainsInfo.find((c) => c.chainId == destinationChainId)
                ?.chainName;
            if (destinationChainName == undefined) return undefined;

            const tokenSymbol = hopConfigJson.contracts.find((c) => c.originChain == sourceChainId)?.originToken;
            if (tokenSymbol == undefined) return undefined;

            const quoteResponse = await this.api.Bridge.getquote({
                sourceChainName: sourceChainName, // chain name
                sourceToken: tokenSymbol, // token symbol
                destinationChainName: destinationChainName, // chain name
                quantity: quantity,
                slippage: slippage,
            });
            if (quoteResponse == undefined) return undefined;

            const contractInfo = hopConfig.contracts.find(
                (c) => c.originChain === sourceChainId && c.originTokenAddress === sourceTokenAddress
            );

            const transactionData = this.prepareTransactionData(
                sourceChainId,
                destinationChainId,
                recipientAddress,
                quoteResponse
            );
            const transactionValue = contractInfo?.originToken == "ETH" ? BigInt(quoteResponse.amountIn) : BigInt(0);
            console.log("transaction value", transactionValue)

            if (!contractInfo?.bridgeAddress) {
                console.error("Error: Missing bridge address");
                return undefined;
            }

            const to = contractInfo.bridgeAddress;
            return new BridgeOperationInformation(
                BigInt(quoteResponse.estimatedRecieved),
                to,
                transactionData,
                transactionValue,
                BigInt(quoteResponse.amountIn) - BigInt(quoteResponse.estimatedRecieved),
                quoteResponse.deadline
            );
        } catch (error) {
            console.error("Error fetching data:", error);
            return undefined;
        }
    }
    getBridgeProviderInformation(): BridgeProviderInformation {
        return new BridgeProviderInformation("hopBridge", "Hop Bridge");
    }
    async getAllBridgeableTokensToChain(destinationChainId: number, originChainId?: number): Promise<ChainToken[]> {
        const hopConfig: HopConfig = hopConfigJson;

        // check destination is available
        const availableDestinationChains = this.getAvailableDestinationChains(originChainId);
        if (!availableDestinationChains.includes(destinationChainId)) return [];

        // get contracts with the origin argument (where origin != destination)
        const contracts = hopConfig.contracts.filter((c) => {
            if (c.originChain == destinationChainId) return false;
            if (originChainId == undefined) return true;
            return c.originChain == originChainId;
        });

        // convert to ChainToken
        const tokens = hopConfig.tokens;
        return contracts.flatMap((e) => {
            const token = tokens.find((t) => t.token === e.originToken);
            if (token == undefined) return [];
            return new ChainToken(e.originChain, e.originTokenAddress, token.token, token.nDecimals, token.imgUrl);
        });
    }
    async getAllPossibleOriginChainsToChain(
        destinationChainId: number,
        tokenAddress?: string | null
    ): Promise<number[]> {
        const hopConfig: HopConfig = hopConfigJson;

        const availableDestinationChains = this.getAvailableDestinationChains();
        if (!availableDestinationChains.includes(destinationChainId)) return [];

        const contracts = hopConfig.contracts.filter((c) => {
            if (tokenAddress == undefined) return true;
            c.originTokenAddress == tokenAddress;
        });

        return contracts.map((c) => c.originChain).filter((c) => c != destinationChainId);
    }

    private prepareTransactionData(
        sourceChainId: number,
        destinationChainId: number,
        recipientAddress: string,
        quoteData: HopApiQuoteResponse
    ): any {
        const iface = new ethers.utils.Interface([
            "function sendToL2(uint256 chainId, address recipient, uint256 amount, uint256 amountOutMin, uint256 deadline, address relayer, uint256 relayerFee)",
            "function swapAndSend(uint256 chainId, address recipient, uint256 amount, uint256 bonderFee, uint256 amountOutMin, uint256 deadline, uint256 destinationAmountOutMin, uint256 destinationDeadline)",
        ]);
        var data;
        if (sourceChainId === 1) {
            data = iface.encodeFunctionData("sendToL2", [
                destinationChainId,
                recipientAddress,
                BigInt(quoteData.amountIn),
                BigInt(quoteData.amountOutMin),
                quoteData.deadline,
                "0x710bDa329b2a6224E4B44833DE30F38E7f81d564",
                0,
            ]);
        } else {
            data = iface.encodeFunctionData("swapAndSend", [
                destinationChainId,
                recipientAddress,
                BigInt(quoteData.amountIn),
                BigInt(quoteData.bonderFee),
                BigInt(quoteData.amountOutMin),
                quoteData.deadline,
                BigInt(quoteData.destinationAmountOutMin??0),
                BigInt(quoteData.destinationDeadline??0),
            ]);
        }
        return data;
    }

    private getAvailableDestinationChains(originChain?: number): number[] {
        const hopConfig: HopConfig = hopConfigJson;
        return hopConfig.contracts.map((v) => v.originChain).filter((c) => c != originChain);
    }

    getUrlForTransactionHash(hash:string):string|undefined{
        return "https://explorer.hop.exchange/?transferId="+hash;
    }
}
