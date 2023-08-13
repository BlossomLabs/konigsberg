import { ChainToken } from "../model/ChainToken";

export class BridgeOperationStatusSuccess {}
export class BridgeOperationStatusError {
    public readonly errorCode: string;
    public readonly errorMsg: string;
    constructor(errorCode: string, errorMsg: string) {
        this.errorCode = errorCode;
        this.errorMsg = errorMsg;
    }
}

export class BridgeOperation {
    status: BridgeOperationStatusError | BridgeOperationStatusSuccess;
    transactionId: string;
    constructor(transactionId: string, status: BridgeOperationStatusError | BridgeOperationStatusSuccess) {
        this.status = status;
        this.transactionId = transactionId;
    }
}

export class BridgeOperationInformation {
    public readonly estimatedAmount: BigInt;
    public readonly contractAddress: string;
    public readonly transactionData: string;
    public readonly transactionValue: BigInt;
    public readonly estimatedFee: BigInt;
    public readonly estimatedDate: number;
    constructor(
        estimatedAmount: BigInt,
        contractAddress: string,
        transactionData: string,
        transactionValue: BigInt,
        estimatedFee: BigInt,
        estimatedDate: number
    ) {
        this.estimatedAmount = estimatedAmount;
        this.contractAddress = contractAddress;
        this.transactionData = transactionData;
        this.transactionValue = transactionValue;
        this.estimatedFee = estimatedFee;
        this.estimatedDate = estimatedDate
    }
}

export class BridgeProviderInformation {
    public readonly name: string = "Unknown Bridge Provider";
    public readonly id: string = "UnknownId";
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}

export interface BridgeProvider {
    // info
    getBridgeProviderQuoteInformation(
        sourceChainId: number,
        sourceTokenAddress: string | null,
        destinationChainId: number,
        quantity: BigInt,
        slippage: number,
        recipientAddress: string
    ): Promise<BridgeOperationInformation | undefined>;
    getBridgeProviderInformation(): BridgeProviderInformation;
    getAllBridgeableTokensToChain(destinationChainId: number, originChainId?: number): Promise<ChainToken[]>;
    getAllPossibleOriginChainsToChain(destinationChainId: number, tokenAddress?: string|null): Promise<number[]>;
    getUrlForTransactionHash(hash:string):string|undefined;
}
