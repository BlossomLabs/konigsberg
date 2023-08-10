export interface CelerApiChain {
    id: number;
    name: string;
    icon: string;
    block_delay: number;
    gas_token_symbol: string;
    explore_url?: string;
    contract_addr: string;
    drop_gas_amt?: string;
    drop_gas_cost_amt?: string;
    drop_gas_balance_alert: string;
    suggested_gas_cost: string;
    flat_usd_fee: number;
    farming_reward_contract_addr?: string;
    transfer_agent_contract_addr: string;
}

export function anyToCelerApiChain(a: any): CelerApiChain | undefined {
    try {
        //const key = Object.keys(a)[0];
        //return a[key] as CelerApiChain;
        return a as CelerApiChain
    } catch (e) {
        return undefined;
    }
}
