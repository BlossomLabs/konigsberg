import "@testing-library/jest-dom";
import { CelerBridgeProvider } from "../../../../infrastructure/bridges/celer/CelerBridgeProvider";
import { assert } from "console";

const celerBridgeProvider : CelerBridgeProvider = new CelerBridgeProvider();
const SECONDS = 1000;
describe("Celer sdk ", () => {
    it("getAllPossibleOriginChainsToChain",
        async () => {
            // should only get chain 1 for AKARO
            const res = await celerBridgeProvider.getAllPossibleOriginChainsToChain(56, "0x426C58f0A9733d874D9962Ed59F529478771751c");
            // expect(res[0]).toEqual(1);
            // expect(res.length).toEqual(1);
        },
        10 * SECONDS
    );

    it("getAllBridgeableTokensToChain",
        async () => {
            // should only get FNCY between these two chains
            const res = await celerBridgeProvider.getAllBridgeableTokensToChain(56, 73);
            
            // expect(res[0].chainId).toEqual(73);
            // expect(res[0].contractAddress).toEqual("0xA4bABEc52aC418B51591B6Cc823744126014731C");
            // expect(res.length).toEqual(1);
        },
        10 * SECONDS
    );
});