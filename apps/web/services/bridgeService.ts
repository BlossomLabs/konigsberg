/**
 * Data Model Interfaces
 */
import { BridgeProvider } from "../domain/bridges/BridgeProvider";
import { ChainToken } from "../domain/tokens/ChainToken";

/**
 * In-Memory Store
 */

let bridgeProviders = [
    {
        id: "li.fi",
        name: "lifi",
    },
];

/**
 * Service Methods
 */

const getAllBridgeProviders = async (): Promise<BridgeProvider[]> => {
    return Object.values(bridgeProviders).map((o) => o as any as BridgeProvider);
};

export const getAllBridgeableTokensFromChain = async (originChainId: number): Promise<ChainToken[]> => {
    const providers = await getAllBridgeProviders();
    const allTokensLists  = await Promise.all(
        providers.map(async (p) =>
            await getAllBridgeableTokensFromChainAndBridgeProvider(originChainId, p.getBridgeProviderInformation().id
        )
    ));

    var allTokens = allTokensLists.flat().filter((e, index, self) => self.indexOf(e) == index)
    return allTokens;
};

const getAllBridgeableTokensFromChainAndBridgeProvider = async (
    originChainId: number,
    bridgeProviderId: string
): Promise<ChainToken[]> => {
    // TODO
    return [];
};

// returns a list of chainIds (for every chain that you can bridge tokens to)
export const getCompatibleDestinationChains = async (originChainId : number, tokenId: number) : Promise<number[]> => {
    const providers = await getAllBridgeProviders();
    const allChainsLists  = await Promise.all(
        providers.map(async (p) =>
            await getCompatibleDestinationChainsForBridgeService(originChainId, tokenId)
        )
    );

    var allChains = allChainsLists.flat().filter((e, index, self) => self.indexOf(e) == index)
    return allChains;
}

const getCompatibleDestinationChainsForBridgeService = async (originChainId : number, tokenId: number) : Promise<number[]> => {
    // TODO
    return [];
}

export const getBestBridgeProviderForBridging = async (originChainId: number, destinationChainId: number, tokenId: number) : Promise<BridgeProvider|undefined> => {
    // TODO
    return undefined;
}
