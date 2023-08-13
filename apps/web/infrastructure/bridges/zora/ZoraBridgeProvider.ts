import { ethers } from "ethers";
import {
    BridgeOperationInformation,
    BridgeProvider,
    BridgeProviderInformation,
} from "../../../domain/bridges/BridgeProvider";
import { ChainToken } from "../../../domain/model/ChainToken";

export class ZoraBridgeProvider implements BridgeProvider {
    getUrlForTransactionHash(hash: string): string | undefined {
        return "https://etherscan.io/tx/"+hash;
    }

    async getBridgeProviderQuoteInformation(
        sourceChainId: number,
        sourceTokenAddress: string | null,
        destinationChainId: number,
        quantity: BigInt,
        slippage: number,
        recipientAddress: string
    ): Promise<BridgeOperationInformation | undefined> {

        if (sourceChainId != 1) return undefined;
        if (destinationChainId != 7777777) return undefined;
        if (sourceTokenAddress != null) return undefined;

        const transactionData = this.prepareTransactionData(recipientAddress, quantity);

        return new BridgeOperationInformation(
            quantity,
            '0x1a0ad011913A150f69f6A19DF447A0CfD9551054',
            transactionData,
            quantity,
            BigInt(0),
            Date.now() / 1000 + 3 * 60, // 3 minutes
        );
    }
    getBridgeProviderInformation(): BridgeProviderInformation {
        return new BridgeProviderInformation("zoraBridge", "Zora Bridge");
    }
    async getAllBridgeableTokensToChain(destinationChainId: number, originChainId?: number): Promise<ChainToken[]> {

        if (destinationChainId != 7777777) return [];
        if (originChainId !== undefined && originChainId !== 1) return [];
        
        return [
            new ChainToken(1, null, 'ETH', 18, 'https://get.celer.app/cbridge-icons/chain-icon/ETH.png')
        ]
    }
    async getAllPossibleOriginChainsToChain(
        destinationChainId: number,
        tokenAddress?: string | null
    ): Promise<number[]> {

        if (destinationChainId != 7777777) return [];
        if (tokenAddress !== undefined && tokenAddress !== null) return [];
        
        return [1];
    }

    private prepareTransactionData(
        recipientAddress: string,
        quantity: BigInt
    ): any {
        const iface = new ethers.utils.Interface([
            "function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes _data)",
        ]);
        let data = iface.encodeFunctionData("depositTransaction", [
            recipientAddress,
            quantity.toString(),
            100000,
            false,
            "0x00",
        ]);

        return data;
    }
}
