import {
    ConnectionProvider,
    WalletProvider,
  } from "wallet-adapter-react-xnft";
  import { BackpackWalletAdapter } from "@solana/wallet-adapter-backpack";
  import React, { useMemo } from "react";
  import { useEndpoint } from "@strata-foundation/react";
  import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
  
  export const DEFAULT_ENDPOINT = "https://rpc.helius.xyz/?api-key=6b1ccd35-ba2d-472a-8f54-9ac2c3c40b8b";
  
  const config: any = {
    commitment: "confirmed",
  };
  
  export const Wallet = ({
    children,
    cluster,
  }: {
    children: React.ReactNode;
    cluster?: string;
  }) => {
    const { endpoint, cluster: clusterFromUseEndpoint } = useEndpoint();
  
    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded
    const wallets = useMemo(
      () => [
      ],
      [clusterFromUseEndpoint]
    );
  
    return (
      
      <ConnectionProvider endpoint={cluster || endpoint} config={config}>
        <WalletProvider wallets={wallets} autoConnect>
          {/* @ts-ignore */}
          {children}
        </WalletProvider>
      </ConnectionProvider>
    );
  };
  