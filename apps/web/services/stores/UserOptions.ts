class Token {
    symbol: string|undefined = undefined;
    chainId: number|undefined = undefined;
    amountToBeSent: number|undefined = undefined;
}

export default class UserOptions{
    selectedTokens: Token[] = [];
}