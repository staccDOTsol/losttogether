import React from "react";
declare type CodeExec = (vars: any) => Promise<void>;
interface IVariablesContext {
    variables: any;
    setVariables: React.Dispatch<any>;
    register: (name: string, deps: string[], exec: CodeExec) => void;
    execWithDeps: (name: string) => Promise<void>;
}
export declare const VariablesContext: React.Context<IVariablesContext>;
export declare const VariablesProvider: React.FC<React.PropsWithChildren>;
export declare const useVariablesContext: () => IVariablesContext;
export declare const useVariables: () => any;
export {};
//# sourceMappingURL=variables.d.ts.map