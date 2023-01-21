import React from "react";
import { Text, View } from "react-native";
import { Swap, usePublicKey, StrataProviders } from '../../strata/packages/react'
import { Screen } from "../components/Screen";
import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from "wallet-adapter-react-xnft";

export function SwapBonkers() {

  const { connected } = useWallet()

  return (    
  <StrataProviders>
      <Screen>
        <View> {!connected && 
            <WalletMultiButton />
          }
          { connected && (
            <div>
              <WalletDisconnectButton />
              <Swap id={usePublicKey("4Vyh36V9dYQdqUtxWc2nEzvezLjKn5qW5rPWACo8wddF")} />
            </div>
          ) }
        </View>
      </Screen>
  </StrataProviders>
  );
}
