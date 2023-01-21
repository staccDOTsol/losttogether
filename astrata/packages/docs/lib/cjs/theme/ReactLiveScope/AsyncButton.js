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
exports.recursiveTransformBN = void 0;
//@ts-ignore
const BrowserOnly_1 = __importDefault(require("@docusaurus/BrowserOnly"));
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const chat_ui_1 = require("@strata-foundation/chat-ui");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const web3_js_1 = require("@solana/web3.js");
const react_1 = require("@strata-foundation/react");
const bn_js_1 = __importDefault(require("bn.js"));
const clsx_1 = __importDefault(require("clsx"));
const esprima_1 = require("esprima");
const react_2 = __importStar(require("react"));
const fa_1 = require("react-icons/fa");
const variables_1 = require("../Root/variables");
//@ts-ignore
const styles_module_css_1 = __importDefault(require("./styles.module.css"));
const web3_js_2 = require("@solana/web3.js");
const marketplace_ui_1 = require("@strata-foundation/marketplace-ui");
function BrowserOnlyReactJson(props) {
    return (react_2.default.createElement(BrowserOnly_1.default, { fallback: react_2.default.createElement("div", null, "...") }, () => {
        const Component = require("react-json-view").default;
        return react_2.default.createElement(Component, Object.assign({}, props));
    }));
}
function wrapAndCollectVars(code, injectedVars) {
    const wrapped = `(async function() {
    ${code}
  }())`;
    const declarations = (0, esprima_1.parse)(wrapped)
        .body[0].expression.callee.body.body.filter(({ type }) => type === "VariableDeclaration")
        .flatMap(({ declarations }) => declarations)
        .map(({ id }) => id);
    const variables = declarations.flatMap(({ type, name, properties }) => {
        if (type === "Identifier") {
            return [name];
        }
        else if (type === "ObjectPattern") {
            return properties.map(({ key }) => key.name);
        }
        return [];
    });
    return `
(async function() {
  var { ${Object.keys(injectedVars).join(", ")} } = injectedVars;
  ${code}
  ${variables.map((variable) => `vars.${variable} = ${variable};`).join("\n")}
}())
  `;
}
// Turn all BN into base 10 numbers as strings
function recursiveTransformBN(args, seen = new Map()) {
    if (seen.has(args)) {
        return seen.get(args);
    }
    const ret = Object.entries(args).reduce((acc, [key, value]) => {
        if (value instanceof bn_js_1.default) {
            acc[key] = value.toString(10);
        }
        else if (value instanceof web3_js_1.PublicKey) {
            // @ts-ignore
            acc[key] = value.toBase58();
        }
        else if (value && value._bn) {
            acc[key] = new web3_js_1.PublicKey(new bn_js_1.default(value._bn, "hex")).toBase58();
        }
        else if (typeof value === "object" && value !== null) {
            seen.set(args, null);
            acc[key] = recursiveTransformBN(value, seen);
        }
        else {
            acc[key] = value;
        }
        return acc;
    }, {});
    seen.set(args, ret);
    return ret;
}
exports.recursiveTransformBN = recursiveTransformBN;
const AsyncButton = ({ code, scope, name, deps, allowMainnet = false }) => {
    const [loading, setLoading] = (0, react_2.useState)(false);
    const [runningThisCommand, setRunningThisCommand] = (0, react_2.useState)(false);
    const { register, execWithDeps } = (0, variables_1.useVariablesContext)();
    const [variables, setVariables] = (0, react_2.useState)(null);
    const [error, setError] = (0, react_2.useState)();
    const { connected, publicKey } = (0, wallet_adapter_react_1.useWallet)();
    const sdks = (0, react_1.useStrataSdks)();
    const { marketplaceSdk } = (0, marketplace_ui_1.useMarketplaceSdk)();
    const { provider } = (0, react_1.useProvider)();
    const { chatSdk } = (0, chat_ui_1.useChatSdk)();
    const { endpoint, setClusterOrEndpoint } = (0, react_1.useEndpoint)();
    var vars = {}; // Outer variable, not stored.
    const exec = (0, react_2.useMemo)(() => {
        function execInner(globalVariables) {
            return __awaiter(this, void 0, void 0, function* () {
                setRunningThisCommand(true);
                const connection = new web3_js_1.Connection((0, web3_js_2.clusterApiUrl)(wallet_adapter_base_1.WalletAdapterNetwork.Devnet));
                try {
                    try {
                        const walletAcct = publicKey && (yield connection.getAccountInfo(publicKey));
                        if (!walletAcct || walletAcct.lamports < 500000000) {
                            publicKey &&
                                (yield connection.requestAirdrop(publicKey, 1000000000));
                        }
                    }
                    catch (e) {
                        // ignore. If we can't airdrop it's probably mainnet
                    }
                    const injectedVars = Object.assign(Object.assign(Object.assign(Object.assign({ provider }, sdks), { marketplaceSdk,
                        chatSdk,
                        publicKey }), scope), globalVariables);
                    yield eval(wrapAndCollectVars(code, injectedVars));
                    setVariables(vars);
                    return Object.assign(Object.assign({}, globalVariables), vars);
                }
                finally {
                    setRunningThisCommand(false);
                }
            });
        }
        return execInner;
    }, [
        chatSdk,
        marketplaceSdk,
        provider,
        publicKey,
        sdks.tokenCollectiveSdk,
        sdks.tokenMetadataSdk,
        sdks.tokenBondingSdk,
    ]);
    function wrappedExecWithDeps() {
        return __awaiter(this, void 0, void 0, function* () {
            setError(undefined);
            setLoading(true);
            try {
                yield execWithDeps(name);
            }
            catch (e) {
                setError(e);
            }
            finally {
                setLoading(false);
            }
        });
    }
    (0, react_2.useEffect)(() => {
        register(name, deps.filter(Boolean), exec);
    }, [publicKey, ...Object.values(sdks), marketplaceSdk, chatSdk]);
    (0, react_2.useEffect)(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);
    const fullLoading = loading || !sdks.tokenBondingSdk || !sdks.tokenCollectiveSdk;
    if (!(endpoint.includes("devnet") || endpoint.includes("localhost")) &&
        !allowMainnet) {
        return (react_2.default.createElement("div", { className: styles_module_css_1.default.container },
            react_2.default.createElement("button", { onClick: () => {
                    setClusterOrEndpoint(wallet_adapter_base_1.WalletAdapterNetwork.Devnet);
                }, className: "white button button--primary" }, "Switch to Devnet")));
    }
    return (react_2.default.createElement("div", { className: styles_module_css_1.default.container },
        (!sdks.tokenBondingSdk || !sdks.tokenCollectiveSdk) && (react_2.default.createElement("div", null, "Loading SDK...")),
        loading && !runningThisCommand && (react_2.default.createElement("div", null, "Running previous commands...")),
        loading && runningThisCommand && react_2.default.createElement("div", null, "Loading..."),
        error ? (react_2.default.createElement("div", null, error.toString())) : fullLoading ? undefined : (react_2.default.createElement(BrowserOnlyReactJson, { theme: "bright:inverted", collapsed: 1, displayDataTypes: false, name: false, src: recursiveTransformBN(variables || {}) })),
        connected && (react_2.default.createElement("button", { disabled: fullLoading, className: (0, clsx_1.default)(styles_module_css_1.default.runButton, "white button button--primary"), onClick: wrappedExecWithDeps },
            react_2.default.createElement(fa_1.FaPlay, { className: styles_module_css_1.default.buttonIcon }),
            " Run")),
        !connected && (react_2.default.createElement(react_2.default.Fragment, null,
            react_2.default.createElement(wallet_adapter_react_ui_1.WalletModalProvider, null,
                react_2.default.createElement(wallet_adapter_react_ui_1.WalletMultiButton, null))))));
};
exports.default = (props) => (react_2.default.createElement(BrowserOnly_1.default, { fallback: react_2.default.createElement("div", null, "...") }, () => react_2.default.createElement(AsyncButton, Object.assign({}, props))));
//# sourceMappingURL=AsyncButton.js.map