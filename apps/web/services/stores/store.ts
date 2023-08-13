import { createContext, useContext } from "react"; 
 
import { BridgeService } from "../bridgeService";

import { HopBridgeProvider } from "../../infrastructure/bridges/hop/HopBridgeProvider";
import { CelerBridgeProvider } from "../../infrastructure/bridges/celer/CelerBridgeProvider";
import { ZoraBridgeProvider } from "../../infrastructure/bridges/zora/ZoraBridgeProvider";
 
import UserOptions from "./UserBridgeOperation";
import UserBridgeOperation from "./UserBridgeOperation";

interface Store {
    // usual stores
    UserBridgeOperation: UserBridgeOperation,

    // using the store as a service locator
    bridgeService : BridgeService, 
} 
 
export const store: Store = { 
    bridgeService: new BridgeService([new HopBridgeProvider(), new CelerBridgeProvider(), new ZoraBridgeProvider()]), 
    UserBridgeOperation: new UserBridgeOperation(),
} 
 
export const StoreContext = createContext(store) 
 
 
export function useStore() { 
    return useContext(StoreContext) 
}