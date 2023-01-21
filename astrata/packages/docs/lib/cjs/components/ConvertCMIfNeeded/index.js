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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertCMIfNeeded = void 0;
const variables_1 = require("../../theme/Root/variables");
const react_1 = __importDefault(require("react"));
const bn_js_1 = __importDefault(require("bn.js"));
const react_2 = require("@strata-foundation/react");
const marketplace_ui_1 = require("@strata-foundation/marketplace-ui");
const react_3 = require("@chakra-ui/react");
const spl_utils_1 = require("@strata-foundation/spl-utils");
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const react_async_hook_1 = require("react-async-hook");
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const wallet_adapter_react_ui_1 = require("@solana/wallet-adapter-react-ui");
const react_4 = require("@strata-foundation/react");
function convertToLBC(provider, targetMint, cm) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(provider, targetMint, cm);
        if (provider && targetMint && cm) {
            const instructions = [];
            const incinerator = new web3_js_1.PublicKey("gravk12G8FF5eaXaXSe4VEC8BhkxQ7ig5AHdeVdPmDF");
            const incineratorAta = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, targetMint, incinerator, true);
            if (!(yield provider.connection.getAccountInfo(incineratorAta))) {
                instructions.push(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, targetMint, incineratorAta, incinerator, provider.wallet.publicKey));
            }
            const updateIX = yield cm.program.instruction.updateCandyMachine(Object.assign(Object.assign({}, cm.data), { price: new bn_js_1.default(1) }), {
                accounts: {
                    candyMachine: cm.publicKey,
                    authority: provider.wallet.publicKey,
                    wallet: incineratorAta,
                },
            });
            updateIX.keys.push({
                pubkey: targetMint,
                isWritable: false,
                isSigner: false,
            });
            instructions.push(updateIX);
            yield (0, spl_utils_1.sendInstructions)(new Map(), provider, instructions, []);
        }
    });
}
const ConvertCMIfNeeded = () => {
    const { connected } = (0, wallet_adapter_react_1.useWallet)();
    const { provider } = (0, react_2.useProvider)();
    const variables = (0, variables_1.useVariables)();
    const tokenBondingKey = (0, react_4.usePublicKey)(variables === null || variables === void 0 ? void 0 : variables.tokenBondingKey);
    const candyMachineKey = (0, react_4.usePublicKey)(variables === null || variables === void 0 ? void 0 : variables.candyMachineId);
    const { info: bonding, loading: loadingBonding } = (0, react_2.useTokenBonding)(tokenBondingKey);
    const { info: cm, loading: loadingCM } = (0, marketplace_ui_1.useCandyMachine)(candyMachineKey);
    const { setVisible } = (0, wallet_adapter_react_ui_1.useWalletModal)();
    const isConverted = bonding && cm && cm.tokenMint && cm.tokenMint.equals(bonding.targetMint);
    const { execute: convert, loading: converting, error, } = (0, react_async_hook_1.useAsyncCallback)(convertToLBC);
    const { handleErrors } = (0, react_2.useErrorHandler)();
    handleErrors(error);
    const loading = loadingBonding || loadingCM || converting;
    if (!connected) {
        return (react_1.default.createElement(react_3.Button, { variant: "outline", colorScheme: "primary", onClick: () => setVisible(true), mb: 2 }, "Connect Wallet"));
    }
    return (react_1.default.createElement(react_3.Button, { mb: 2, variant: "outline", colorScheme: "primary", isDisabled: isConverted, isLoading: loading, onClick: () => convert(provider, bonding === null || bonding === void 0 ? void 0 : bonding.targetMint, cm) }, isConverted ? "Already using LBC" : "Convert back to LBC"));
};
exports.ConvertCMIfNeeded = ConvertCMIfNeeded;
//# sourceMappingURL=index.js.map