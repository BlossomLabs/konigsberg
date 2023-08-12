export interface HopApiQuoteRequest {
    sourceChainName: string;
    sourceToken: string;
    destinationChainName: string;
    quantity: BigInt;
    slippage: number;
}
