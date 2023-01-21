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
exports.CloseOutWumbo = exports.Recoup = exports.TokenHandler = void 0;
//@ts-ignore
const BrowserOnly_1 = __importDefault(require("@docusaurus/BrowserOnly"));
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const react_1 = require("@strata-foundation/react");
const spl_token_bonding_1 = require("@strata-foundation/spl-token-bonding");
const react_2 = __importStar(require("react"));
//@ts-ignore
const react_3 = require("@chakra-ui/react");
const spl_token_1 = require("@solana/spl-token");
const spl_utils_1 = require("@strata-foundation/spl-utils");
const closeOutWumboSubmit_1 = require("./closeOutWumboSubmit");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
//@ts-ignore
const styles_module_css_1 = __importDefault(require("./styles.module.css"));
const OPEN_COLLECTIVE = "3cYa5WvT2bgXSLxxu9XDJSHV3x5JZGM91Nc3B7jYhBL7";
const MainnetGuard = ({ children = null }) => {
    const { endpoint, setClusterOrEndpoint } = (0, react_1.useEndpoint)();
    if (endpoint.includes("devnet")) {
        return (react_2.default.createElement("div", { className: styles_module_css_1.default.container },
            react_2.default.createElement("h3", null, "Recoup SOL from Wumbo"),
            react_2.default.createElement("button", { onClick: () => {
                    setClusterOrEndpoint(wallet_adapter_base_1.WalletAdapterNetwork.Mainnet);
                }, className: "white button button--primary" }, "Switch to Mainnet")));
    }
    return children;
};
exports.TokenHandler = react_2.default.memo(({ token, setAmountByToken }) => {
    var _a, _b;
    const { publicKey: tokenBondingKey, targetMint } = token.tokenBonding;
    const unixTime = (0, react_1.useSolanaUnixTime)();
    const { pricing, loading: loadingPricing } = (0, react_1.useBondingPricing)(tokenBondingKey);
    const solAmount = pricing === null || pricing === void 0 ? void 0 : pricing.swap((0, spl_token_bonding_1.toNumber)(token.account.amount, token.mint), targetMint, spl_token_1.NATIVE_MINT, true, unixTime);
    (0, react_2.useEffect)(() => {
        if (solAmount) {
            setAmountByToken(token, solAmount);
        }
    }, [solAmount, setAmountByToken]);
    return (react_2.default.createElement(react_3.Box, null,
        react_2.default.createElement(react_3.Stack, { direction: "row", spacing: 4, align: "center" },
            react_2.default.createElement(react_3.Avatar, { src: token.image, size: "sm" }),
            react_2.default.createElement(react_3.Stack, { direction: "column", spacing: 0, fontSize: "sm" },
                react_2.default.createElement(react_3.Text, { fontWeight: 600 }, (_b = (_a = token.metadata) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.name),
                react_2.default.createElement(react_3.Text, { color: "gray.500" },
                    solAmount,
                    " SOL")))));
});
const Recoup = () => {
    const { connected, publicKey } = (0, wallet_adapter_react_1.useWallet)();
    const { tokenBondingSdk, loading: sdkLoading } = (0, react_1.useStrataSdks)();
    const [txError, setError] = (0, react_2.useState)();
    const { handleErrors } = (0, react_1.useErrorHandler)();
    const [amountsByToken, setAmountsByToken] = (0, react_2.useState)({});
    const [status, setStatus] = (0, react_2.useState)(null);
    const [isCalculatingTokens, setIsCalculatingTokens] = (0, react_2.useState)(true);
    const { setVisible } = (0, wallet_adapter_react_ui_1.useWalletModal)();
    const openCollectiveKey = (0, react_1.usePublicKey)(OPEN_COLLECTIVE);
    const { info: openCollective } = (0, react_1.useCollective)(openCollectiveKey);
    const { amount: rentAmount } = (0, react_1.useRentExemptAmount)(165);
    const { data: tokens, loading: loading1, error, } = (0, react_1.useUserTokensWithMeta)(publicKey || undefined);
    const setAmountByToken = (0, react_2.useCallback)((token, amount) => {
        if (token && amount) {
            setAmountsByToken((old) => (Object.assign(Object.assign({}, old), { [token.publicKey.toBase58()]: amount + (rentAmount || 0) })));
        }
    }, []);
    const open = (0, react_2.useMemo)(() => tokens.find(({ account }) => account.mint.equals(openCollective.mint)), [tokens]);
    const hasOpenAmount = (0, react_2.useMemo)(() => open && (0, spl_token_bonding_1.toNumber)(open.account.amount, open.mint) > 0, [open]);
    const openCollectiveTokens = (0, react_2.useMemo)(() => tokens.filter((token) => !!token.tokenRef &&
        token.tokenRef.collective &&
        token.tokenRef.collective.equals(openCollectiveKey) &&
        (0, spl_token_bonding_1.toNumber)(token.account.amount, token.mint) > 0), [tokens]);
    (0, react_2.useEffect)(() => {
        if (Object.values(amountsByToken).length ===
            (openCollectiveTokens === null || openCollectiveTokens === void 0 ? void 0 : openCollectiveTokens.length) + (hasOpenAmount ? 1 : 0)) {
            setIsCalculatingTokens(false);
        }
    }, [amountsByToken, hasOpenAmount, openCollectiveTokens]);
    handleErrors(error, txError);
    const handleSubmit = (0, react_2.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, closeOutWumboSubmit_1.closeOutWumboSubmit)({
                tokenBondingSdk,
                tokens: openCollectiveTokens.filter(spl_utils_1.truthy),
                expectedOutputAmountByToken: amountsByToken,
                setStatus,
            });
        }
        catch (err) {
            console.error(err);
            setStatus(null);
            setError(err);
        }
    }), [open, hasOpenAmount, openCollectiveTokens, amountsByToken]);
    const loading = sdkLoading || loading1 || isCalculatingTokens;
    const connectedLoading = connected && publicKey && loading;
    const connectedNotLoading = !loading && connected && publicKey;
    const isSuccessful = status == "successful";
    const isOrphaned = status == "orphaned";
    return (react_2.default.createElement(react_3.VStack, { w: "full", align: "stretch", className: styles_module_css_1.default.container },
        react_2.default.createElement("h3", null, "Recoup SOL from Wumbo"),
        connectedLoading && react_2.default.createElement("span", null, "Loading..."),
        connectedNotLoading &&
            !(hasOpenAmount || openCollectiveTokens.length) && (react_2.default.createElement("span", null, "No tokens relating to Wumbo/OPEN found. Make sure you have the wallet that you used with Wumbo/OPEN, then refresh this page.")),
        error && react_2.default.createElement("span", { style: { color: "red" } }, error.toString()),
        connectedNotLoading && !isSuccessful && !isOrphaned && (react_2.default.createElement(react_2.default.Fragment, null,
            react_2.default.createElement(react_3.SimpleGrid, { columns: { base: 1, md: 2 }, gap: 2 },
                hasOpenAmount && (react_2.default.createElement(exports.TokenHandler, { token: open, setAmountByToken: setAmountByToken })),
                openCollectiveTokens.map((token) => (react_2.default.createElement(exports.TokenHandler, { key: token.publicKey.toBase58(), token: token, setAmountByToken: setAmountByToken })))),
            react_2.default.createElement(react_3.Stack, { mt: 4, gap: 2 },
                react_2.default.createElement(react_3.Alert, { status: "info", variant: "subtle", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", height: "200px" },
                    react_2.default.createElement(react_3.AlertIcon, { boxSize: "30px", mr: 0 }),
                    react_2.default.createElement(react_3.AlertTitle, { mt: 4, mb: 1, fontSize: "lg" },
                        Object.values(amountsByToken).reduce((acc, amount) => acc + amount, 0),
                        " ",
                        "SOL"),
                    react_2.default.createElement(react_3.AlertDescription, { maxWidth: "sm" }, "Ready to be Recouped. Thanks for giving Wumbo a try. Our team greatly appreciates you and your early support!")),
                react_2.default.createElement(react_3.Button, { size: "lg", colorScheme: "orange", disabled: loading || status !== null, isLoading: status !== null, loadingText: status, onClick: handleSubmit, _hover: { cursor: "pointer" } }, "Recoup SOL")))),
        connectedNotLoading && isSuccessful && (react_2.default.createElement(react_3.Alert, { status: "success", variant: "subtle", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", height: "200px" },
            react_2.default.createElement(react_3.AlertIcon, { boxSize: "30px", mr: 0 }),
            react_2.default.createElement(react_3.AlertTitle, { mt: 4, mb: 1, fontSize: "lg" }, "SOL Recouped"),
            react_2.default.createElement(react_3.AlertDescription, { maxWidth: "sm" }, "Thanks for giving Wumbo a try. Our team greatly appreciates you and your early support!"))),
        connectedNotLoading && isOrphaned && (react_2.default.createElement(react_3.Alert, { status: "warning", variant: "subtle", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", height: "200px" },
            react_2.default.createElement(react_3.AlertIcon, { boxSize: "30px", mr: 0 }),
            react_2.default.createElement(react_3.AlertTitle, { mt: 4, mb: 1, fontSize: "lg" }, "Something went wrong"),
            react_2.default.createElement(react_3.AlertDescription, { maxWidth: "sm" }, "I looks like we were unable to recoup the full amount of SOL, one or multiple of the transactions may have failed. Please refresh and try again."))),
        react_2.default.createElement(react_3.Button, { onClick: () => setVisible(true), colorScheme: "orange", variant: "outline" }, publicKey ? (0, react_1.truncatePubkey)(publicKey) : "Select Wallet")));
};
exports.Recoup = Recoup;
const CloseOutWumbo = () => (react_2.default.createElement(BrowserOnly_1.default, { fallback: react_2.default.createElement("div", null, "...") }, () => (react_2.default.createElement(MainnetGuard, null,
    react_2.default.createElement(exports.Recoup, null)))));
exports.CloseOutWumbo = CloseOutWumbo;
//# sourceMappingURL=index.js.map