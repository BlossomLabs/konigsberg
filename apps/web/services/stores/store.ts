import { createContext, useContext } from "react"; 
 
import { BridgeService } from "../bridgeService";
import { CelerBridgeProvider } from "../../infrastructure/bridges/celer/CelerBridgeProvider";
 
import UserOptions from "./UserOptions";
import { MockBridgeProvider } from "../../infrastructure/bridges/MockBridgeProvider";

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