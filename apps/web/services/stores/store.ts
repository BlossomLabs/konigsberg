import { createContext, useContext } from "react"; 
 
import { BridgeService } from "../bridgeService";
import { CelerBridgeProvider } from "../../infrastructure/bridges/celer/CelerBridgeProvider";
 
import UserOptions from "./UserBridgeOperation";
import { MockBridgeProvider } from "../../infrastructure/bridges/MockBridgeProvider";
import UserBridgeOperation from "./UserBridgeOperation";

interface Store {
    // usual stores
    UserBridgeOperation: UserBridgeOperation,

    // using the store as a service locator
    bridgeService : BridgeService, 
} 
 
export const store: Store = { 
    bridgeService: new BridgeService([new CelerBridgeProvider()]), 
    UserBridgeOperation: new UserBridgeOperation(),
} 
 
export const StoreContext = createContext(store) 
 
 
export function useStore() { 
    return useContext(StoreContext) 
}