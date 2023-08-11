import { CelerApiTokenInfo, celerApiTokenInfoFromAny } from "./CelerApiTokenInfo";

export interface CelerApiPeggedPairConfig {
    org_chain_id : number,
    org_token : CelerApiTokenInfo | undefined,
    pegged_chain_id : number,
    pegged_token: CelerApiTokenInfo | undefined,
    pegged_deposit_contract_addr : string,
    pegged_burn_contract_addr : string,
    canonical_token_contract_addr : string,
    vault_version : number,
    bridge_version: number,
    migration_peg_burn_contract_addr : string
}

export function celerApiPeggedPairConfigFromAny(a: any): CelerApiPeggedPairConfig | undefined {
    if(a == undefined)
        return undefined;
    const orgToken : CelerApiTokenInfo | undefined = celerApiTokenInfoFromAny(a.org_token);
    const peggedToken : CelerApiTokenInfo | undefined = celerApiTokenInfoFromAny(a.pegged_token);

    return {
        org_chain_id: a.org_chain_id,
        org_token: orgToken,
        pegged_chain_id: a.pegged_chain_id,
        pegged_token : peggedToken,
        pegged_deposit_contract_addr : a.pegged_deposit_contract_addr,
        pegged_burn_contract_addr: a.pegged_burn_contract_addr,
        canonical_token_contract_addr : a.canonical_token_contract_addr,
        vault_version : a.vault_version,
        bridge_version : a.bridge_version,
        migration_peg_burn_contract_addr : a.migration_peg_burn_contract_addr
    };
}