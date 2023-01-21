import React from "react";
import { ITokenWithMetaAndAccount } from "@strata-foundation/spl-token-collective";
interface ITokenHandlerProps {
    token: ITokenWithMetaAndAccount;
    setAmountByToken: (arg0: ITokenWithMetaAndAccount, arg1: number) => void;
}
export declare const TokenHandler: React.NamedExoticComponent<ITokenHandlerProps>;
export declare const Recoup: () => JSX.Element;
export declare const CloseOutWumbo: React.FC;
export {};
//# sourceMappingURL=index.d.ts.map