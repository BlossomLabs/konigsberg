export class ChainInfo { 
    public readonly id: number;
    public readonly name: string;
    public readonly icon: string;
    public readonly blockDelay: number;
    public readonly gasTokenSymbol: string;
    public readonly exploreUrl?: string;
    public readonly contractAddress: string;
    public readonly dropGasAMT?: string;
    public readonly dropGasCostAMT?: string;
    public readonly dropGasBalanceAlert: string;
    public readonly suggestedGasCost: string;
    public readonly flatUSDFee: number;
    public readonly farmingRewardContractAddress?: string;
    public readonly transferAgentContractAddress: string;

    public constructor(id: number, name: string, icon: string, blockDelay: number, gasTokenSymbol: string, exploreUrl: string, contractAddress: string, dropGasAMT: string, dropGasCostAMT: string, dropGasBalanceAlert: string, suggestedGasCost: string, flatUSDFee: number, farmingRewardContractAddress: string, transferAgentContractAddress: string) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.blockDelay = blockDelay;
        this.gasTokenSymbol = gasTokenSymbol;
        this.exploreUrl = exploreUrl;
        this.contractAddress = contractAddress;
        this.dropGasAMT = dropGasAMT;
        this.dropGasCostAMT = dropGasCostAMT;
        this.dropGasBalanceAlert = dropGasBalanceAlert;
        this.suggestedGasCost = suggestedGasCost;
        this.flatUSDFee = flatUSDFee;
        this.farmingRewardContractAddress = farmingRewardContractAddress;
        this.transferAgentContractAddress = transferAgentContractAddress;
    }

}
