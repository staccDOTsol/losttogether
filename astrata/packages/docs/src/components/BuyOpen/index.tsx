import React from "react";
//@ts-ignore
import BrowserOnly from "@docusaurus/BrowserOnly";
import { useEndpoint } from "@strata-foundation/react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useWallet } from "wallet-adapter-react-xnft";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { Swap } from "@strata-foundation/react";
import { SplTokenCollective } from "@strata-foundation/spl-token-collective";
//@ts-ignore
import styles from "./styles.module.css";

const MainnetGuard = ({ children = null as any }) => {
  const { endpoint, setClusterOrEndpoint } = useEndpoint();

  if (endpoint.includes("devnet")) {
    return (
      <div className={styles.container}>
        <button
          onClick={() => {
            setClusterOrEndpoint(WalletAdapterNetwork.Mainnet);
          }}
          className="white button button--primary"
        >
          Switch to Mainnet
        </button>
      </div>
    );
  }

  return children;
};

export const Buy = () => {
  const mintKey = SplTokenCollective.OPEN_COLLECTIVE_MINT_ID;
  const { connected, publicKey } = useWallet();

  return (
    <div className={styles.container}>
      {!connected && (
        <WalletModalProvider>
          <WalletMultiButton />
        </WalletModalProvider>
      )}
      {connected && <Swap id={mintKey} />}
    </div>
  );
};

export const BuyOpen: React.FC = () => (
  <BrowserOnly fallback={<div>...</div>}>
    {() => (
      <MainnetGuard>
        <Buy />
      </MainnetGuard>
    )}
  </BrowserOnly>
);
