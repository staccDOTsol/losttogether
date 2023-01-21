import { SplTokenBonding } from "@strata-foundation/spl-token-bonding";
import { ITokenWithMetaAndAccount } from "@strata-foundation/spl-token-collective";
import React from "react";
interface ICloseOutWumboSubmitOpts {
    tokenBondingSdk: SplTokenBonding | undefined;
    tokens: ITokenWithMetaAndAccount[];
    expectedOutputAmountByToken: {
        [key: string]: number;
    };
    setStatus: React.Dispatch<React.SetStateAction<string>>;
}
export declare const closeOutWumboSubmit: ({ tokenBondingSdk, tokens, expectedOutputAmountByToken, setStatus, }: ICloseOutWumboSubmitOpts) => Promise<void>;
export {};
//# sourceMappingURL=closeOutWumboSubmit.d.ts.map