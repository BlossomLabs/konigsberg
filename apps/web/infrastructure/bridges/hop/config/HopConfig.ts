export interface HopConfig {
    contracts: HopContractInfo[];
    tokens: HopTokenInfo[];
    chainsInfo : HopChainInfo[];
}

export interface HopContractInfo {
    originChain: number;
    originToken: string;
    originTokenAddress: string | null;
    bridgeAddress: string;
}

export interface HopTokenInfo {
    token: string;
    imgUrl: string;
    nDecimals: number;
}

export interface HopChainInfo {
    chainId: number;
    chainName: string;
}
