import { ChainToken } from "../tokens/ChainToken";

export class BridgeOperationStatusSuccess {

}
export class BridgeOperationStatusError {
    public readonly errorCode : string;
    public readonly errorMsg : string;
    constructor(errorCode: string, errorMsg : string){
        this.errorCode = errorCode;
        this.errorMsg = errorMsg;
    }
}

export class BridgeOperation {
    status : BridgeOperationStatusError|BridgeOperationStatusSuccess;
    transactionId: number;
    constructor(transactionId: number, status: BridgeOperationStatusError|BridgeOperationStatusSuccess) {
        this.status = status;
        this.transactionId = transactionId;
    }
}

export class BridgeOperationInformation {
    public readonly estimatedOperationCost : number;
    public readonly estimatedFee : number;
    constructor(estimatedOperationCost: number, estimatedFee: number){
        this.estimatedFee = estimatedFee;
        this.estimatedOperationCost = estimatedOperationCost;
    }
}

export class BridgeProviderInformation {
    public readonly name: string = 'Unknown Bridge Provider';
    public readonly id : string = 'UnknownId';
    constructor(id: string, name: string){
        this.id = id;
        this.name = name;
    }
}

export interface BridgeProvider {
    // exec
    bridgeTokens(sourceWalletId: number, sourceChainId: number, sourceTokenId: number, destinationWalletId :number, destinationChainId:number, quantity:number) : Promise<BridgeOperation>;
    
    // info
    getBridgeProviderQuoteInformation(sourceWalletId: number, sourceChainId: number, sourceTokenId: number, destinationChainId:number, quantity:number) : Promise<BridgeOperationInformation>;
    getBridgeProviderInformation() : BridgeProviderInformation;
    getAllBridgeableTokensFromChain(chainId: number) : Promise<ChainToken[]>;
}