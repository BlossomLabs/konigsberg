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
    public readonly estimatedOperationCost: BigInt;
    public readonly estimatedFee: BigInt;
    constructor(estimatedOperationCost: BigInt, estimatedFee: BigInt) {
        this.estimatedFee = estimatedFee;
        this.estimatedOperationCost = estimatedOperationCost;
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
    // exec
    bridgeTokens(
        sourceWalletAddress: string,
        sourceChainId: number,
        sourceTokenAddress: string,
        destinationWalletAddress: string,
        destinationChainId: number,
        quantity: BigInt
    ): Promise<BridgeOperation>;

    // info
    getBridgeProviderQuoteInformation(
        sourceWalletAddress: string,
        sourceChainId: number,
        sourceTokenAddress: string,
        destinationChainId: number,
        quantity: BigInt
    ): Promise<BridgeOperationInformation>;
    getBridgeProviderInformation(): BridgeProviderInformation;
    getAllBridgeableTokensToChain(destinationChainId: number, originChainId?: number): Promise<ChainToken[]>;
    getAllPossibleOriginChainsToChain(destinationChainId: number, tokenAddress?: string): Promise<number[]>;
    
}
