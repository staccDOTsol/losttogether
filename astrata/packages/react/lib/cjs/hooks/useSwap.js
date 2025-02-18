"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSwap = void 0;
const react_async_hook_1 = require("react-async-hook");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const useStrataSdks_1 = require("./useStrataSdks");
const useSwap = (swapArgs = {}) => {
    const { connected, publicKey } = (0, wallet_adapter_react_1.useWallet)();
    const { tokenBondingSdk, loading: sdkLoading } = (0, useStrataSdks_1.useStrataSdks)();
    const { result: data, execute, error, loading, } = (0, react_async_hook_1.useAsyncCallback)((args) => __awaiter(void 0, void 0, void 0, function* () {
        if (!connected || !publicKey || !tokenBondingSdk)
            throw new wallet_adapter_base_1.WalletNotConnectedError();
        return yield tokenBondingSdk.swap(Object.assign(Object.assign({}, args), swapArgs));
    }));
    return {
        execute,
        data,
        loading,
        error,
    };
};
exports.useSwap = useSwap;
//# sourceMappingURL=useSwap.js.map