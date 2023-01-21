"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableDisburseFunds = void 0;
const react_1 = __importDefault(require("react"));
const marketplace_ui_1 = require("@strata-foundation/marketplace-ui");
const variables_1 = require("../../theme/Root/variables");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const emotion_1 = __importDefault(require("react-shadow/emotion"));
const react_2 = require("@chakra-ui/react");
function VariableDisburseFunds({ closeBonding = false, closeEntangler = false, }) {
    const variables = (0, variables_1.useVariables)();
    const { connected } = (0, wallet_adapter_react_1.useWallet)();
    if (!connected) {
        return react_1.default.createElement(wallet_adapter_react_ui_1.WalletMultiButton, null);
    }
    return (
    // @ts-ignore
    react_1.default.createElement(emotion_1.default.div, null,
        react_1.default.createElement(react_2.Box, { mb: "16px" },
            react_1.default.createElement(react_2.CSSReset, null),
            react_1.default.createElement(marketplace_ui_1.DisburseFunds, { id: variables.id, tokenBondingKey: variables.tokenBondingKey, closeBonding: closeBonding, closeEntangler: closeEntangler }))));
}
exports.VariableDisburseFunds = VariableDisburseFunds;
//# sourceMappingURL=index.js.map