import { CelerApiToken } from "./CelerApiToken";

// export class CelerApiChainTokenInfoExtractor {
//     private parsingObj: any;
//     constructor(obj: any) {
//         this.parsingObj = obj;
//     }

//     public getChainIds(): number[] {
//         return Object.keys(this.parsingObj).map(e => Number(e))
//     }

//     public getChainToken(chainId: number): CelerApiChainToken | undefined {
//         try {
//             const chainTokenInfoBody: { token: any } | undefined = this.parsingObj[String(chainId)] as
//                 | { token: any }
//                 | undefined;

//             if (chainTokenInfoBody == undefined || chainTokenInfoBody.token == undefined) return undefined;

//             const chainTokenIndexes: string = Object.keys(chainTokenInfoBody.token);
//             const chainTokenBody: CelerApiChainToken | undefined = chainTokenInfoBody.token[chainTokenIndex] as
//                 | CelerApiChainToken
//                 | undefined;
//             return chainTokenBody;
//         } catch (e) {
//             return undefined;CelerApiChainToken
//         }
//     }
// }

export interface CelerApiTokenInfo {
    token: CelerApiToken;
    name: string;
    icon: string;
    inbound_lmt: string;
    inbound_epoch_cap: string;
    transfer_disabled: boolean;
    liq_add_disabled: boolean;
    liq_rm_disabled: boolean;
    liq_agg_rm_src_disabled: boolean;
    delay_threshold: string;
    delay_period: number;
}

export function celerApiTokenInfoFromAny(a: any): CelerApiTokenInfo | undefined {
    try {
        return a as CelerApiTokenInfo;
    } catch (e) {
        return undefined;
    }
}
