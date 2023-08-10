import { CelerApiChain, anyToCelerApiChain } from "../models/CelerApiChain";
import { CelerApiChainToken, celerApiChainTokenFromAny } from "../models/CelerApiChainToken";

export interface CelerApiTransferConfigResponse {
    err: any;
    chains: CelerApiChain[];
    chain_token: Map<number, CelerApiChainToken[]>;
    farming_reward_contract_addr: string;
    pegged_pair_configs: any[]; // TODO
    blocked_bridge_direct: any[]; // TODO
}

function getCelerApiChainTokenAnyArray(objectFromChainId: any) : any[] | undefined{
    const celerApiChainToken = objectFromChainId?.token;
    if (celerApiChainToken == undefined || !Array.isArray(celerApiChainToken)) return undefined;

    return celerApiChainToken as any[];
}

export function anyToCelerApiTransferConfigResponse(a: any): CelerApiTransferConfigResponse | undefined {
    const chainToken = a.chain_token;
    const chainTokenMap: Map<number, CelerApiChainToken[]> = new Map();
    Object.keys(chainToken).forEach((key) => {
        const celerApiChainTokenAnyArray : any[] | undefined = getCelerApiChainTokenAnyArray(chainToken[key])
        const celerApiChainTokenObjArray : CelerApiChainToken[] | undefined = celerApiChainTokenAnyArray?.flatMap(e => celerApiChainTokenFromAny(e)??[]);
        if (celerApiChainTokenObjArray != undefined) chainTokenMap.set(Number(key), celerApiChainTokenObjArray);
    });

    return {
        err: a.err,
        chains: a.chains.map((e: any) => anyToCelerApiChain(e)),
        chain_token: chainTokenMap,
        farming_reward_contract_addr : a.farming_reward_contract_addr,
        pegged_pair_configs : a.pegged_pair_configs,
        blocked_bridge_direct: a.blocked_bridge_direct
    };
}
