export interface HopConfig {
    contracts: HopContractInfo[];
    tokens: HopTokenInfo[]
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
    tokenAddress: string | null;
}
