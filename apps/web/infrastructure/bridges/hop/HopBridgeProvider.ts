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

export class HopBridgeProvider implements BridgeProvider {
    async getBridgeProviderQuoteInformation(
        sourceChainId: number,
        sourceTokenAddress: string | null,
        destinationChainId: number,
        quantity: BigInt,
        slippage: number,
        recipientAddress: string
    ): Promise<BridgeOperationInformation | undefined> {
        const hopQuoteUrl = `https://api.hop.exchange/v1/quote?amount=${quantity.toString()}&token=${sourceTokenAddress}&fromChain=${sourceChainId}&toChain=${destinationChainId}&slippage=${slippage}`;

        try {
            const quoteResponse = await fetch(hopQuoteUrl);
            const quoteJson = await quoteResponse.json();
            const hopConfig: HopConfig = hopConfigJson;

            const contractInfo = hopConfig.contracts.find(
                (c) => c.originChain === sourceChainId && c.originToken === sourceTokenAddress
            );

            const transactionData = this.prepareTransactionData(
                sourceChainId,
                destinationChainId,
                recipientAddress,
                quoteJson
            );
            const transactionValue = contractInfo?.originToken == "ETH" ? quoteJson.amountIn : 0;

            if (!contractInfo?.bridgeAddress) {
                console.error("Error: Missing bridge address");
                return undefined;
            }

            const to = contractInfo.bridgeAddress;
            return new BridgeOperationInformation(
                quoteJson.estimatedRecieved,
                to,
                transactionData,
                transactionValue,
                quoteJson.estimatedFee
            );
        } catch (error) {
            console.error("Error fetching data:", error);
            return undefined;
        }
    }
    getBridgeProviderInformation(): BridgeProviderInformation {
        return new BridgeProviderInformation("hopBridge", "Hop Bridge");
    }
    async getAllBridgeableTokensToChain(
        destinationChainId: number,
        originChainId: number | undefined
    ): Promise<ChainToken[]> {
        const hopConfig: HopConfig = hopConfigJson;

        const availableDestinationChains = hopConfig.contracts
            .map((v) => v.originChain)
            .filter((v) => v != originChainId);

        const contracts = hopConfig.contracts.filter((c) => {
            if(!availableDestinationChains.includes(destinationChainId))
                return false;
            if(originChainId != undefined)
                return c.originChain == originChainId;
            return true;
        });

        const tokens = hopConfig.tokens;

        if (contracts == undefined) return [];

        return contracts.flatMap((e) => {
            const token = tokens.find((t)=> t.token === e.originToken);
            if(token == undefined)
                return [];
            return new ChainToken(e.originChain, token.tokenAddress, token.token, token.nDecimals, token.imgUrl)
        });
    }
    getAllPossibleOriginChainsToChain(
        destinationChainId: number,
        tokenAddress: string | undefined
    ): Promise<number[]> {
        throw new Error("Method not implemented.");
    }

    private prepareTransactionData(
        sourceChainId: number,
        destinationChainId: number,
        recipientAddress: string,
        quoteData: any
    ): any {
        const iface = new ethers.utils.Interface([
            "sendToL2(uint256 chainId, address recipient, uint256 amount, uint256 amountOutMin, uint256 deadline, address relayer, uint256 relayerFee)",
            "swapAndSend(uint256 chainId, address recipient, uint256 amount, uint256 bonderFee, uint256 amountOutMin, uint256 deadline, uint256 destinationAmountOutMin, uint256 destinationDeadline)",
        ]);

        var data;
        if (sourceChainId === 1) {
            data = iface.encodeFunctionData("sendToL2", [
                destinationChainId,
                recipientAddress,
                quoteData.amountIn,
                quoteData.amountOutMin,
                quoteData.deadline,
                "0x710bDa329b2a6224E4B44833DE30F38E7f81d564",
                0,
            ]);
        } else {
            data = iface.encodeFunctionData("swapAndSend", [
                sourceChainId,
                recipientAddress,
                quoteData.amountIn,
                quoteData.bonderFee,
                quoteData.amountOutMin,
                quoteData.deadline,
                quoteData.destinationAmountOutMin,
                quoteData.destinationDeadline,
            ]);
        }
        return data;
    }
}
