import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, Chain, Client } from "wagmi";
import { goerli, mainnet, optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, optimism, ...(process.env.NODE_ENV === "development" ? [goerli] : [])],
  [publicProvider()]
) as { chains: Chain[], provider: any, webSocketProvider: any };

const { connectors } = getDefaultWallets({
  appName: "Pregel",
  chains,
});

export const client: Client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export { chains , provider };
