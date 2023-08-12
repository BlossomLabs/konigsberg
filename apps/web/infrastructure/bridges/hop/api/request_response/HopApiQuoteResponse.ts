export interface HopApiQuoteResponse {
    amountIn: string,
    slippage: number,
    amountOutMin: string,
    destinationAmountOutMin : string | null,
    bonderFee: string,
    estimatedRecieved: string,
    deadline: number,
    destinationDeadline: string | null
}
