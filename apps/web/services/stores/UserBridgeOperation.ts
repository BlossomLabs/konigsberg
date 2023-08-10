export class OperationToken {
    symbol: string | undefined = undefined;
    chainId: number | undefined = undefined;
    amountToBeSent: number | undefined = undefined;
}

export default class UserBridgeOperation {
    operationTokens: OperationToken[] = [];
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
}