"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkSelect = void 0;
const react_1 = __importDefault(require("react"));
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const react_2 = require("@chakra-ui/react");
const react_3 = require("@strata-foundation/react");
const NetworkSelect = () => {
    const { cluster, setClusterOrEndpoint } = (0, react_3.useEndpoint)();
    return (react_1.default.createElement(react_2.VStack, { mb: 8, align: "start" },
        react_1.default.createElement(react_2.Heading, { size: "md" }, "Network"),
        react_1.default.createElement(react_2.Select, { value: cluster, onChange: (e) => setClusterOrEndpoint(e.target.value) },
            react_1.default.createElement("option", { value: wallet_adapter_base_1.WalletAdapterNetwork.Devnet }, "Devnet"),
            react_1.default.createElement("option", { value: wallet_adapter_base_1.WalletAdapterNetwork.Mainnet }, "Mainnet"),
            react_1.default.createElement("option", { value: "localnet" }, "Localnet"))));
};
exports.NetworkSelect = NetworkSelect;
//# sourceMappingURL=index.js.map