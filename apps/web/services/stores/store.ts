import { createContext, useContext } from "react"; 
 
import { BridgeService } from "../bridgeService";
import { LiFiBridgeProvider } from "../../domain/bridges/impl/LiFiBridgeProvider";
 

interface Store {
    // usual stores

    // using the store as a service locator
    bridgeService : BridgeService, 
} 
 
export const store: Store = { 
    bridgeService: new BridgeService([new LiFiBridgeProvider()]), 
} 
 
export const StoreContext = createContext(store) 
 
 
export function useStore() { 
    return useContext(StoreContext) 
}