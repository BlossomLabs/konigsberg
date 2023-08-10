export class ChainToken {
    public readonly chainId: number;
    public readonly contractAddress: string;
    public readonly symbol: string;
    public readonly nDecimals : number; // number of decimals for the token
    public readonly imgUrl: string; // url for the token image

    public constructor(chainId: number, contractAddress: string, symbol: string, nDecimals: number, imgUrl: string) {
        this.chainId = chainId;
        this.contractAddress = contractAddress;
        this.symbol = symbol;
        this.nDecimals = nDecimals;
        this.imgUrl = imgUrl;
    }
}