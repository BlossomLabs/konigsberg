/**
 * Data Model Interfaces
 */
import { BridgeProvider } from "../domain/bridges/BridgeProvider";
import { ChainToken } from "../domain/model/ChainToken";

/**
 * Service Methods
 */

export class BridgeService {


    // hardcoded values accessor
    private bridgeProviders : BridgeProvider[];
    constructor(bridgeProviders: BridgeProvider[]){
        this.bridgeProviders = bridgeProviders;
    }

    // service methods 

    private getAllBridgeProviders =  (): BridgeProvider[] => {
        return this.bridgeProviders;
    };

    public getAllBridgeableTokensToChain = async (destinationChainId: number, originChainId?: number): Promise<ChainToken[]> => {
        const providers = await this.getAllBridgeProviders();
        const allTokensLists  = await Promise.all(
            providers.map(async (p) =>
                await this.getAllBridgeableTokensToChainAndBridgeProvider(destinationChainId, originChainId, p.getBridgeProviderInformation().id
            )
        ));

        var allTokens = allTokensLists.flat().filter((e, index, self) => self.indexOf(e) == index)
        return allTokens;
    };

    protected getAllBridgeableTokensToChainAndBridgeProvider = async (
        destinationChainId: number,
        originChainId: number | undefined,
        bridgeProviderId: string
    ): Promise<ChainToken[]> => {
        const provider = this.getAllBridgeProviders().find(p => p.getBridgeProviderInformation().id == bridgeProviderId);
        if(!provider)
            return [];
        return provider.getAllBridgeableTokensToChain(destinationChainId, originChainId);
    };

    // returns a list of chainIds (for every chain that you can bridge tokens to)
    public getCompatibleDestinationChains = async (originChainId : number, tokenAddress: string) : Promise<number[]> => {
        const providers = await this.getAllBridgeProviders();
        const allChainsLists  = await Promise.all(
            providers.map(async (p) =>
                await this.getCompatibleDestinationChainsForBridgeService(originChainId, tokenAddress)
            )
        );

        var allChains = allChainsLists.flat().filter((e, index, self) => self.indexOf(e) == index)
        return allChains;
    }

    protected getCompatibleDestinationChainsForBridgeService = async (originChainId : number, tokenAddress: string) : Promise<number[]> => {
        // TODO
        return [];
    }

    public getBestBridgeProviderForBridging = async (originChainId: number, destinationChainId: number, tokenAddress: string) : Promise<BridgeProvider|undefined> => {
        // TODO
        return undefined;
    }
}