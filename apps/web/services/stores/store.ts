import { createContext, useContext } from "react"; 
 
import { BridgeService } from "../bridgeService";
import { LiFiBridgeProvider } from "../../domain/bridges/impl/LiFiBridgeProvider";
 
import UserOptions from "./UserOptions";
import { MockBridgeProvider } from "../../domain/bridges/impl/MockBridgeProvider";

interface Store {
    // usual stores
    UserOptions: UserOptions,

    // using the store as a service locator
    bridgeService : BridgeService, 
} 
 
export const store: Store = { 
    bridgeService: new BridgeService([new MockBridgeProvider()]), 
    UserOptions: new UserOptions(),
} 
 
export const StoreContext = createContext(store) 
 
 
export function useStore() { 
    return useContext(StoreContext) 
}