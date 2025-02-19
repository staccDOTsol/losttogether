import { useAsyncCallback } from "react-async-hook";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { useWallet } from "wallet-adapter-react-xnft";
import { useStrataSdks } from "./useStrataSdks";
import { ISwapArgs, ITokenBonding, IPreInstructionArgs, IPostInstructionArgs } from "@strata-foundation/spl-token-bonding";
import { InstructionResult } from "@strata-foundation/spl-utils";
import { BN } from "@project-serum/anchor";

export type SwapArgs = {
  preInstructions?: (args: IPreInstructionArgs) => Promise<InstructionResult<null>>; // instructions executed before swap instructions
  postInstructions?: (args: IPostInstructionArgs) => Promise<InstructionResult<null>>; // instructions executed after swap instructions
};

export const useSwap = (
  swapArgs: SwapArgs = {}
): {
  execute: (args: ISwapArgs) => Promise<{ targetAmount: number }>;
  data: { targetAmount: number } | undefined;
  loading: boolean;
  error: Error | undefined;
} => {
  const { connected, publicKey } = useWallet();
  const { tokenBondingSdk, loading: sdkLoading } = useStrataSdks();

  const {
    result: data,
    execute,
    error,
    loading,
  } = useAsyncCallback(async (args: ISwapArgs) => {
    if (!connected || !publicKey || !tokenBondingSdk)
      throw new WalletNotConnectedError();

    return await tokenBondingSdk.swap({ ...args, ...swapArgs });
  });

  return {
    execute,
    data,
    loading,
    error,
  };
};
