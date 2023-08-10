export class OperationToken {
    symbol: string | undefined = undefined;
    chainId: number | undefined = undefined;
    amountToBeSent: number | undefined = undefined;
}

export class OperationConfig {
    destinationChainId: number = 1;
    destinationAddress: string | undefined = undefined;
    transferPreference: string = "Maximum return";
    slippage: number = 1;
}

export default class UserBridgeOperation {
    operationTokens: OperationToken[] = [];
    operationConfig: OperationConfig = new OperationConfig();

    addOperationToken(symbol: string, chainId: number, amountToBeSent: number) {
        const operationExists = this.operationTokens.find((token) => token.symbol === symbol && token.chainId === chainId)

        if (operationExists) {
            this.removeOperationToken(symbol, chainId);
        }

        this.operationTokens.push({
            symbol: symbol,
            chainId: chainId,
            amountToBeSent: amountToBeSent,
        });
    }

    removeOperationToken(symbol: string, chainId: number) {
        this.operationTokens = this.operationTokens.filter((token) => !(token.symbol === symbol && token.chainId === chainId));
    }

    setDestinationChainId(destinationChainId: number) {
        this.operationConfig.destinationChainId = destinationChainId;
    }

    setDestinationAddress(destinationAddress: string) {
        this.operationConfig.destinationAddress = destinationAddress;
    }

    setTransferPreference(transferPreference: string) {
        this.operationConfig.transferPreference = transferPreference;
    }

    setSlippage(slippage: number) {
        this.operationConfig.slippage = slippage;
    }
}