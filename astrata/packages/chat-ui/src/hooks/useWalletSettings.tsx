import { useWallet } from "wallet-adapter-react-xnft";
import { useSettingsKey } from "./useSettingsKey";
import { useSettings } from "./useSettings";

export function useWalletSettings() {
  const { publicKey } = useWallet();
  const { key } = useSettingsKey(publicKey || undefined);

  return useSettings(key)
}
