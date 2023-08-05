export class ChainToken {
    public readonly chainId: number;
    public readonly contractId: number;
    public readonly symbol: string;
    public readonly nDecimals : number; // number of decimals for the token

    public constructor(chainId: number, contractId: number, symbol: string, nDecimals: number) {
        this.chainId = chainId;
        this.contractId = contractId;
        this.symbol = symbol;
        this.nDecimals = nDecimals;
    }
}