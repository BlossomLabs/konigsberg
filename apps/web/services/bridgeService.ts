/**
 * Data Model Interfaces
 */
import { promises } from "dns";
import { BridgeOperationInformation, BridgeProvider } from "../domain/bridges/BridgeProvider";
import { ChainToken } from "../domain/model/ChainToken";

export enum BestBridgeProviderType {
    BEST_TIME,
    BEST_RETURN,
}

/**
 * Service Methods
 */

export class BridgeService {
    // hardcoded values accessor
    private bridgeProviders: BridgeProvider[];
    constructor(bridgeProviders: BridgeProvider[]) {
        this.bridgeProviders = bridgeProviders;
    }

    // service methods

    private getAllBridgeProviders = (): BridgeProvider[] => {
        return this.bridgeProviders;
    };

    public getAllBridgeableTokensToChain = async (
        destinationChainId: number,
        originChainId?: number
    ): Promise<ChainToken[]> => {
        const providers = await this.getAllBridgeProviders();
        const allTokensLists = await Promise.all(
            providers.map(
                async (p) =>
                    await this.getAllBridgeableTokensToChainAndBridgeProvider(
                        destinationChainId,
                        originChainId,
                        p.getBridgeProviderInformation().id
                    )
            )
        );

        var allTokens = allTokensLists.flat().filter((e, index, self) => {
            const firstTokenForChainAndContractAddress = self.find(
                (element) => element.chainId == e.chainId && element.contractAddress == e.contractAddress
            );
            if (firstTokenForChainAndContractAddress == undefined) return false;
            return self.indexOf(firstTokenForChainAndContractAddress) == index;
        });
        return allTokens;
    };

    protected getAllBridgeableTokensToChainAndBridgeProvider = async (
        destinationChainId: number,
        originChainId: number | undefined,
        bridgeProviderId: string
    ): Promise<ChainToken[]> => {
        const provider = this.getAllBridgeProviders().find(
            (p) => p.getBridgeProviderInformation().id == bridgeProviderId
        );
        if (!provider) return [];
        return provider.getAllBridgeableTokensToChain(destinationChainId, originChainId);
    };

    // returns a list of chainIds (for every chain that you can bridge tokens to)
    public getCompatibleOriginChains = async (
        destinationChainId: number,
        tokenAddress: string | null
    ): Promise<number[]> => {
        const providers = await this.getAllBridgeProviders();
        const allChainsLists = await Promise.all(
            providers.map(
                async (p) =>
                    await this.getCompatibleOriginChainsForBridgeService(
                        destinationChainId,
                        tokenAddress,
                        p.getBridgeProviderInformation().id
                    )
            )
        );

        var uniqueChains = allChainsLists.flat().filter((e, index, self) => self.indexOf(e) == index);
        return uniqueChains;
    };

    protected getCompatibleOriginChainsForBridgeService = async (
        destinationChainId: number,
        tokenAddress: string | null,
        bridgeProviderId: string
    ): Promise<number[]> => {
        const provider = this.getAllBridgeProviders().find(
            (p) => p.getBridgeProviderInformation().id == bridgeProviderId
        );
        if (!provider) return [];
        return provider.getAllPossibleOriginChainsToChain(destinationChainId, tokenAddress);
    };

    public getBestBridgeProviderForBridging = async (
        originChainId: number,
        tokenAddress: string|null,
        destinationChainId: number,
        quantity: BigInt,
        slippage: number,
        recipientAddress: string,
        bestType: BestBridgeProviderType
    ): Promise<BridgeProvider | undefined> => {
        const providers = this.getAllBridgeProviders();
        const quotePromises = providers.map((p) =>
            p.getBridgeProviderQuoteInformation(
                originChainId,
                tokenAddress,
                destinationChainId,
                quantity,
                slippage,
                recipientAddress
            )
        );
        const quotes = await Promise.all(quotePromises);

        // get index of best quote
        var bestIndex = 0;
        for (let i = 1; i < quotes.length; i++) {
            if (quotes[bestIndex] == undefined) {
                bestIndex = i;
            } else if (quotes[i] == undefined) {
                // nothing to do, new is undefined and can't be better
            } else {
                // both have quote data
                var encounteredBest = false;
                var triedBest = false;
                if (bestType == BestBridgeProviderType.BEST_TIME) {
                    triedBest = true;
                    if (quotes[i]!.estimatedDate < quotes[bestIndex]!.estimatedDate) {
                        bestIndex = i;
                        encounteredBest = true;
                    } else if (quotes[i]!.estimatedDate != quotes[bestIndex]!.estimatedDate) {
                        // we found the best based on this comparison
                        encounteredBest = true;
                    }
                }
                if ((!encounteredBest && triedBest) || bestType == BestBridgeProviderType.BEST_RETURN){
                    triedBest = true;
                    if (quotes[i]!.estimatedAmount > quotes[bestIndex]!.estimatedAmount) {
                        bestIndex = i;
                        encounteredBest = true;
                    } else if (quotes[i]!.estimatedAmount != quotes[bestIndex]!.estimatedAmount) {
                        // we found the best based on this comparison
                        encounteredBest = true;
                    }
                }
            }
        }


        if (quotes[bestIndex] == undefined) return undefined;
        return providers[bestIndex];
    };
}
