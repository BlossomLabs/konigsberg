export class BridgeOperation {

}

export class BridgeOperationInformation {

}

export class BridgeProviderInformation {
    public name: string = 'Unknown Bridge Provider';
    public id : string = 'UnknownId'
}

export interface BridgeProvider {
    bridgeTokens(sourceWalletId: number, sourceChainId: number, sourceTokenId: number, destinationWalletId :number, destinationChainId:number, quantity:number) : BridgeOperation;
    getOperationInformation(sourceWalletId: number, sourceChainId: number, sourceTokenId: number, destinationChainId:number, quantity:number) : BridgeOperationInformation;
    getBridgeProviderInformation() : BridgeProviderInformation;
}