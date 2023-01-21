"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyOpen = exports.Buy = void 0;
const react_1 = __importDefault(require("react"));
//@ts-ignore
const BrowserOnly_1 = __importDefault(require("@docusaurus/BrowserOnly"));
const react_2 = require("@strata-foundation/react");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const react_3 = require("@strata-foundation/react");
const spl_token_collective_1 = require("@strata-foundation/spl-token-collective");
//@ts-ignore
const styles_module_css_1 = __importDefault(require("./styles.module.css"));
const MainnetGuard = ({ children = null }) => {
    const { endpoint, setClusterOrEndpoint } = (0, react_2.useEndpoint)();
    if (endpoint.includes("devnet")) {
        return (react_1.default.createElement("div", { className: styles_module_css_1.default.container },
            react_1.default.createElement("button", { onClick: () => {
                    setClusterOrEndpoint(wallet_adapter_base_1.WalletAdapterNetwork.Mainnet);
                }, className: "white button button--primary" }, "Switch to Mainnet")));
    }
    return children;
};
const Buy = () => {
    const mintKey = spl_token_collective_1.SplTokenCollective.OPEN_COLLECTIVE_MINT_ID;
    const { connected, publicKey } = (0, wallet_adapter_react_1.useWallet)();
    return (react_1.default.createElement("div", { className: styles_module_css_1.default.container },
        !connected && (react_1.default.createElement(wallet_adapter_react_ui_1.WalletModalProvider, null,
            react_1.default.createElement(wallet_adapter_react_ui_1.WalletMultiButton, null))),
        connected && react_1.default.createElement(react_3.Swap, { id: mintKey })));
};
exports.Buy = Buy;
const BuyOpen = () => (react_1.default.createElement(BrowserOnly_1.default, { fallback: react_1.default.createElement("div", null, "...") }, () => (react_1.default.createElement(MainnetGuard, null,
    react_1.default.createElement(exports.Buy, null)))));
exports.BuyOpen = BuyOpen;
//# sourceMappingURL=index.js.map