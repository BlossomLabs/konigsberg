import "@testing-library/jest-dom";
import { CelerApi } from "../../../../../infrastructure/bridges/celer/api/celerApi";
import { CelerApiTransferConfigResponse } from "../../../../../infrastructure/bridges/celer/api/responses/CelerApiTransferConfigResponse";
import { CelerApiTokenInfo } from "../../../../../infrastructure/bridges/celer/api/models/CelerApiTokenInfo";

const celerApi: CelerApi = new CelerApi();

const SECONDS = 1000;
describe("Celer Api getTransferConfigs", () => {
    var response: CelerApiTransferConfigResponse | undefined;
    beforeAll(async () => {
        response = await celerApi.Bridge.getTransferConfigs();
    }, 20*SECONDS);
    it(
        "no error",
        async () => {
            expect(response?.err).toBeNull();
        },
        10 * SECONDS
    );
    it(
        "chain_token",
        async () => {
            // for chain 1, get first token and check name and symbol
            const tokensForChain1: CelerApiTokenInfo[] | undefined = response?.chain_token.get(1);

            expect(tokensForChain1).not.toBeUndefined();
            expect(tokensForChain1?.length).toBeGreaterThan(0);

            if (tokensForChain1 == undefined) return;
            const firstTokenForChain1: CelerApiTokenInfo | undefined =
                tokensForChain1.length > 0 ? tokensForChain1[0] : undefined;
            expect(firstTokenForChain1).not.toBeUndefined();

            expect(firstTokenForChain1?.name).toBe("Animal Concerts Token");
            expect(firstTokenForChain1?.token?.symbol).toBe("ANML");
        },
        10 * SECONDS
    );
    it(
        "chains",
        async () => {
            expect(response?.chains[0].id).toEqual(1);
            expect(response?.chains[0].name).toEqual("Ethereum Mainnet");
            expect(response?.chains[0].gas_token_symbol).toEqual("ETH");
            expect(response?.chains[0].explore_url).toEqual("https://etherscan.io/");
            expect(response?.chains[0].contract_addr).toEqual("0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820");
        },
        10 * SECONDS
    );
});