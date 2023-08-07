import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, Chain, Client } from "wagmi";
import { goerli, mainnet, optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

// Custom chains

const base: Chain = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://mainnet.base.org'] },
    default: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    public: { name: 'BaseScan', url: 'https://basescan.org' },
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  }
} 

const zora: Chain = {
  id: 7777777,
  name: 'Zora',
  network: 'zora',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://rpc.zora.energy/'] },
    default: { http: ['https://rpc.zora.energy/'] },
  },
  blockExplorers: {
    public: { name: 'Zora explorer', url: 'https://explorer.zora.energy/' },
    default: { name: 'Zora explorer', url: 'https://explorer.zora.energy/' },
  }
} 

// Configure wagmi chains

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, optimism, base, zora, ...(process.env.NODE_ENV === "development" ? [goerli] : [])],
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

export { chains, provider };
