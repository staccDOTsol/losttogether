import { useWallet } from "wallet-adapter-react-xnft";

export function useFtxPayLink(): string {
  const { publicKey } = useWallet();

  return `https://ftx.com/pay/request?coin=SOL&address=${publicKey?.toBase58()}&tag=&wallet=sol&memoIsRequired=false&memo=&fixedWidth=true`;
}
