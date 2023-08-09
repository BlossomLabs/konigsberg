export class ChainToken {
    public readonly chainId: number;
    public readonly contractAddress: string;
    public readonly symbol: string;
    public readonly nDecimals : number; // number of decimals for the token

    public constructor(chainId: number, contractAddress: string, symbol: string, nDecimals: number) {
        this.chainId = chainId;
        this.contractAddress = contractAddress;
        this.symbol = symbol;
        this.nDecimals = nDecimals;
    }
}