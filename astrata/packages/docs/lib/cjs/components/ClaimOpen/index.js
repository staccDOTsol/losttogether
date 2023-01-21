"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimOpen = exports.ClaimO = void 0;
//@ts-ignore
const BrowserOnly_1 = __importDefault(require("@docusaurus/BrowserOnly"));
const react_1 = require("@strata-foundation/react");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const web3_js_1 = require("@solana/web3.js");
const react_2 = require("@strata-foundation/react");
const react_3 = __importStar(require("react"));
const react_async_hook_1 = require("react-async-hook");
//@ts-ignore
const styles_module_css_1 = __importDefault(require("./styles.module.css"));
const TOKEN_BONDING = "BBZ6tFH5b6tWxWebUe7xyWLZ3PHVCLAdRArAEACuJKHe";
const MainnetGuard = ({ children = null }) => {
    const { endpoint, setClusterOrEndpoint } = (0, react_1.useEndpoint)();
    if (endpoint.includes("devnet")) {
        return (react_3.default.createElement("div", { className: styles_module_css_1.default.container },
            react_3.default.createElement("button", { onClick: () => {
                    setClusterOrEndpoint(wallet_adapter_base_1.WalletAdapterNetwork.Mainnet);
                }, className: "white button button--primary" }, "Switch to Mainnet")));
    }
    return children;
};
const roundToDecimals = (num, decimals) => Math.trunc(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
function exchange(tokenBondingSdk, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        yield tokenBondingSdk.sell({
            tokenBonding: new web3_js_1.PublicKey(TOKEN_BONDING),
            targetAmount: amount,
            slippage: 0.05
        });
    });
}
const ClaimO = () => {
    const [success, setSuccess] = (0, react_3.useState)(false);
    const [claimableOPEN, setClaimableOPEN] = (0, react_3.useState)();
    const tokenBondingKey = (0, react_2.usePublicKey)(TOKEN_BONDING);
    const { connected, publicKey } = (0, wallet_adapter_react_1.useWallet)();
    const { info: tokenBonding, loading: loadingBonding } = (0, react_2.useTokenBonding)(tokenBondingKey);
    const { tokenBondingSdk } = (0, react_2.useStrataSdks)();
    const { execute: swap, loading: swapping, error } = (0, react_async_hook_1.useAsyncCallback)(exchange);
    const { handleErrors } = (0, react_2.useErrorHandler)();
    handleErrors(error);
    const { pricing, loading: loadingPricing } = (0, react_2.useBondingPricing)(tokenBondingKey);
    const ownedTarget = (0, react_2.useOwnedAmount)(tokenBonding === null || tokenBonding === void 0 ? void 0 : tokenBonding.targetMint);
    const { associatedAccount } = (0, react_2.useAssociatedAccount)(publicKey, tokenBonding === null || tokenBonding === void 0 ? void 0 : tokenBonding.targetMint);
    const unixTime = (0, react_2.useSolanaUnixTime)();
    (0, react_3.useEffect)(() => {
        if (ownedTarget && ownedTarget >= 0 && tokenBonding && pricing) {
            const claimable = pricing.swap(+ownedTarget, tokenBonding.targetMint, tokenBonding.baseMint, false, unixTime);
            setClaimableOPEN(ownedTarget == 0 ? 0 : roundToDecimals(claimable, 9));
        }
    }, [tokenBonding, pricing, ownedTarget, setClaimableOPEN]);
    const handleExchange = () => __awaiter(void 0, void 0, void 0, function* () {
        yield swap(tokenBondingSdk, associatedAccount.amount);
        setSuccess(true);
    });
    const isLoading = loadingPricing || loadingBonding;
    const connectedNotLoading = connected && !isLoading;
    return (react_3.default.createElement("div", { className: styles_module_css_1.default.container },
        react_3.default.createElement("h3", null, "netbWUM to OPEN Exchange"),
        !connected && (react_3.default.createElement(wallet_adapter_react_ui_1.WalletModalProvider, null,
            react_3.default.createElement(wallet_adapter_react_ui_1.WalletMultiButton, null))),
        isLoading && react_3.default.createElement(react_2.Spinner, null),
        connectedNotLoading && !success && !ownedTarget && !claimableOPEN && (react_3.default.createElement("span", null, "No netbWUM Found. Make sure you have the wallet that participated in the Wum.bo beta connected, then refresh this page.")),
        success && react_3.default.createElement("span", null, "Successfully swapped netbWUM to OPEN!"),
        connectedNotLoading && !success && ownedTarget && claimableOPEN && (react_3.default.createElement("div", { style: { display: "flex", flexDirection: "column" } },
            react_3.default.createElement("p", null,
                "Exchange ",
                ownedTarget.toFixed(4),
                " netbWUM for",
                " ",
                claimableOPEN.toFixed(4),
                " OPEN"),
            react_3.default.createElement("button", { disabled: swapping, onClick: handleExchange, className: "white button button--primary" }, "Exchange")))));
};
exports.ClaimO = ClaimO;
const ClaimOpen = () => {
    return (react_3.default.createElement(BrowserOnly_1.default, { fallback: react_3.default.createElement("div", null, "...") }, () => (react_3.default.createElement(MainnetGuard, null,
        react_3.default.createElement(exports.ClaimO, null)))));
};
exports.ClaimOpen = ClaimOpen;
//# sourceMappingURL=index.js.map