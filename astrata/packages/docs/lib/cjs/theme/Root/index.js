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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const chat_ui_1 = require("@strata-foundation/chat-ui");
const marketplace_ui_1 = require("@strata-foundation/marketplace-ui");
const react_1 = require("@strata-foundation/react");
const react_2 = __importDefault(require("react"));
const react_hot_toast_1 = __importStar(require("react-hot-toast"));
const Wallet_1 = require("../../contexts/Wallet");
require("./bufferFill");
const variables_1 = require("./variables");
// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");
exports.default = ({ children }) => {
    const onError = react_2.default.useCallback((error) => {
        var _a, _b;
        console.error(error);
        if ((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes("Attempt to debit an account but found no record of a prior credit.")) {
            error = new Error("Not enough SOL to perform this action");
        }
        const code = (((_b = error.message) === null || _b === void 0 ? void 0 : _b.match("custom program error: (.*)")) ||
            [])[1];
        if (code == "0x1") {
            error = new Error("Insufficient balance.");
        }
        else if (code == "0x136") {
            error = new Error("Purchased more than the cap of 100 bWUM");
        }
        else if (code === "0x0") {
            error = new Error("Blockhash expired. Please retry");
        }
        react_hot_toast_1.default.custom((t) => (react_2.default.createElement(react_1.Notification, { type: "error", show: t.visible, heading: error.name, 
            // @ts-ignore
            message: error.message || error.msg || error.toString(), onDismiss: () => react_hot_toast_1.default.dismiss(t.id) })));
    }, [react_hot_toast_1.default]);
    return (react_2.default.createElement(react_2.default.Fragment, null,
        react_2.default.createElement(react_1.ThemeProvider, null,
            react_2.default.createElement(react_1.ErrorHandlerProvider, { onError: onError },
                react_2.default.createElement(Wallet_1.Wallet, null,
                    react_2.default.createElement(react_1.ProviderContextProvider, null,
                        react_2.default.createElement(wallet_adapter_react_ui_1.WalletModalProvider, null,
                            react_2.default.createElement(react_1.AccountProvider, { commitment: "confirmed" },
                                react_2.default.createElement(react_1.StrataSdksProvider, null,
                                    react_2.default.createElement(marketplace_ui_1.MarketplaceSdkProvider, null,
                                        react_2.default.createElement(chat_ui_1.ChatSdkProvider, null,
                                            react_2.default.createElement(react_1.GraphqlProvider, null,
                                                react_2.default.createElement(chat_ui_1.EmojisProvider, null,
                                                    react_2.default.createElement(chat_ui_1.ReplyProvider, null,
                                                        react_2.default.createElement(react_1.AcceleratorProvider, { url: "wss://prod-api.teamwumbo.com/accelerator" },
                                                            react_2.default.createElement(variables_1.VariablesProvider, null,
                                                                children,
                                                                react_2.default.createElement(react_hot_toast_1.Toaster, { position: "bottom-center", containerStyle: {
                                                                        margin: "auto",
                                                                        width: "420px",
                                                                    } })))))))))))))))));
};
//# sourceMappingURL=index.js.map