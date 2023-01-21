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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const react_1 = __importStar(require("react"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_ledger_1 = require("@solana/wallet-adapter-ledger");
const wallet_adapter_phantom_1 = require("@solana/wallet-adapter-phantom");
const wallet_adapter_solflare_1 = require("@solana/wallet-adapter-solflare");
const wallet_adapter_glow_1 = require("@solana/wallet-adapter-glow");
const wallet_adapter_exodus_1 = require("@solana/wallet-adapter-exodus");
const react_2 = require("@strata-foundation/react");
// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");
const config = {
    commitment: "confirmed",
};
//@ts-ignore
const Wallet = ({ children }) => {
    // You can also provide a custom RPC endpoint
    const { endpoint, cluster } = (0, react_2.useEndpoint)();
    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded
    const wallets = (0, react_1.useMemo)(() => [
        new wallet_adapter_phantom_1.PhantomWalletAdapter(),
        // @ts-ignore
        new wallet_adapter_solflare_1.SolflareWalletAdapter({ network: cluster }),
        new wallet_adapter_glow_1.GlowWalletAdapter(),
        new wallet_adapter_ledger_1.LedgerWalletAdapter(),
        new wallet_adapter_exodus_1.ExodusWalletAdapter(),
    ], [cluster]);
    return (react_1.default.createElement(wallet_adapter_react_1.ConnectionProvider, { endpoint: endpoint, config: config },
        react_1.default.createElement(wallet_adapter_react_1.WalletProvider, { wallets: wallets, autoConnect: true }, children)));
};
exports.Wallet = Wallet;
//# sourceMappingURL=Wallet.js.map