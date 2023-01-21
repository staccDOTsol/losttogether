"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimBwum = exports.Claim = void 0;
//@ts-ignore
const BrowserOnly_1 = __importDefault(require("@docusaurus/BrowserOnly"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const react_1 = require("@strata-foundation/react");
const spl_token_bonding_1 = require("@strata-foundation/spl-token-bonding");
const react_2 = __importDefault(require("react"));
const react_3 = require("@strata-foundation/react");
//@ts-ignore
const styles_module_css_1 = __importDefault(require("./styles.module.css"));
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const TOKEN_BONDING = "B8kzSwXLfmZMeLzekExz2e8vefoU1UqgGnZ8NZRYkeou";
const MainnetGuard = ({ children = null }) => {
    const { endpoint, setClusterOrEndpoint } = (0, react_3.useEndpoint)();
    if (endpoint.includes("devnet")) {
        return (react_2.default.createElement("div", { className: styles_module_css_1.default.container },
            react_2.default.createElement("h3", null, "Net bWUM Exchange"),
            react_2.default.createElement("button", { onClick: () => {
                    setClusterOrEndpoint(wallet_adapter_base_1.WalletAdapterNetwork.Mainnet);
                }, className: "white button button--primary" }, "Switch to Mainnet")));
    }
    return children;
};
exports.Claim = react_2.default.memo(() => {
    const tokenBondingKey = (0, react_1.usePublicKey)(TOKEN_BONDING);
    const { connected, publicKey } = (0, wallet_adapter_react_1.useWallet)();
    const { info: tokenBonding, loading } = (0, react_1.useTokenBonding)(tokenBondingKey);
    const { pricing, loading: loadingPricing } = (0, react_1.useBondingPricing)(tokenBondingKey);
    const { associatedAccount: netBwumAccount, loading: assocAccountLoading } = (0, react_1.useAssociatedAccount)(publicKey, tokenBonding === null || tokenBonding === void 0 ? void 0 : tokenBonding.targetMint);
    const targetMint = (0, react_1.useMint)(tokenBonding === null || tokenBonding === void 0 ? void 0 : tokenBonding.targetMint);
    const netTotal = netBwumAccount &&
        targetMint &&
        (0, spl_token_bonding_1.toNumber)(netBwumAccount.amount, targetMint) / Math.pow(10, 9);
    const solTotal = netTotal && (pricing === null || pricing === void 0 ? void 0 : pricing.sellTargetAmount(netTotal));
    const connectedNotLoading = !(loading || loadingPricing || assocAccountLoading) && connected;
    const { execute, loading: executing, error } = (0, react_1.useSwap)();
    const { handleErrors } = (0, react_1.useErrorHandler)();
    handleErrors(error);
    return (react_2.default.createElement("div", { className: styles_module_css_1.default.container },
        react_2.default.createElement("h3", null, "Net bWUM Exchange"),
        !connected && (react_2.default.createElement(wallet_adapter_react_ui_1.WalletModalProvider, null,
            react_2.default.createElement(wallet_adapter_react_ui_1.WalletMultiButton, null))),
        (loadingPricing || loading || assocAccountLoading) && (react_2.default.createElement("span", null, "Loading...")),
        connectedNotLoading && !netTotal && !solTotal && (react_2.default.createElement("span", null, "No Net bWUM Found. Make sure you have the wallet that participated in the Wum.bo beta connected, then refresh this page.")),
        error && react_2.default.createElement("span", { style: { color: "red" } }, error.toString()),
        connectedNotLoading && netTotal && solTotal && (react_2.default.createElement("div", { style: { display: "flex", flexDirection: "column" } },
            react_2.default.createElement("p", null,
                "Exchange ",
                netTotal.toFixed(4),
                " Net bWUM for ",
                solTotal.toFixed(4),
                " ",
                "SOL"),
            react_2.default.createElement("button", { disabled: executing, onClick: () => {
                    if (tokenBonding) {
                        execute({
                            baseMint: tokenBonding.targetMint,
                            targetMint: tokenBonding.baseMint,
                            baseAmount: netTotal,
                            slippage: 0.05,
                        });
                    }
                }, className: "white button button--primary" }, "Exchange")))));
});
const ClaimBwum = () => {
    return (react_2.default.createElement(BrowserOnly_1.default, { fallback: react_2.default.createElement("div", null, "...") }, () => (react_2.default.createElement(MainnetGuard, null,
        react_2.default.createElement(exports.Claim, null)))));
};
exports.ClaimBwum = ClaimBwum;
//# sourceMappingURL=index.js.map