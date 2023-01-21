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
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeOutWumboSubmit = void 0;
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const spl_token_collective_1 = require("@strata-foundation/spl-token-collective");
const spl_utils_1 = require("@strata-foundation/spl-utils");
const chunks = (array, size) => Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) => array.slice(index * size, (index + 1) * size));
const closeOutWumboSubmit = ({ tokenBondingSdk, tokens, expectedOutputAmountByToken, setStatus, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let processedTokenCount = 0;
    let innerError = null;
    if (!tokenBondingSdk)
        return;
    const openAta = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, spl_token_collective_1.SplTokenCollective.OPEN_COLLECTIVE_MINT_ID, tokenBondingSdk.wallet.publicKey);
    console.log(openAta.toBase58());
    if (!(yield tokenBondingSdk.accountExists(openAta))) {
        setStatus("Setting up");
        const tx = new web3_js_1.Transaction();
        tx.recentBlockhash = (yield tokenBondingSdk.provider.connection.getLatestBlockhash()).blockhash;
        tx.feePayer = tokenBondingSdk.wallet.publicKey;
        tx.add(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, spl_token_collective_1.SplTokenCollective.OPEN_COLLECTIVE_MINT_ID, openAta, tokenBondingSdk.wallet.publicKey, tokenBondingSdk.wallet.publicKey));
        const signed = yield tokenBondingSdk.wallet.signTransaction(tx);
        yield (0, spl_utils_1.sendAndConfirmWithRetry)(tokenBondingSdk.provider.connection, signed.serialize(), {
            skipPreflight: true,
        }, "confirmed");
    }
    setStatus("Recouping SOL");
    const closeInstrs = [];
    const txs = yield Promise.all(tokens.map((token) => __awaiter(void 0, void 0, void 0, function* () {
        const { publicKey: tokenBondingKey, targetMint } = token.tokenBonding;
        const { instructions } = yield tokenBondingSdk.sellInstructions({
            tokenBonding: tokenBondingKey,
            targetAmount: token.account.amount,
            expectedOutputAmount: expectedOutputAmountByToken[token.publicKey.toBase58()],
            slippage: 0.5,
        });
        closeInstrs.push(yield spl_token_1.Token.createCloseAccountInstruction(spl_token_1.TOKEN_PROGRAM_ID, token.publicKey, tokenBondingSdk.wallet.publicKey, tokenBondingSdk.wallet.publicKey, []));
        const tx = new web3_js_1.Transaction();
        tx.recentBlockhash = (yield tokenBondingSdk.provider.connection.getLatestBlockhash()).blockhash;
        tx.feePayer = tokenBondingSdk.wallet.publicKey;
        tx.add(...instructions);
        return tx;
    })));
    const signed = yield tokenBondingSdk.wallet.signAllTransactions(txs);
    for (let [index, tx] of signed.entries()) {
        setStatus(`Swapping: ${(_b = (_a = tokens[index].metadata) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.name}`);
        try {
            yield (0, spl_utils_1.sendAndConfirmWithRetry)(tokenBondingSdk.provider.connection, tx.serialize(), {
                skipPreflight: true,
            }, "confirmed");
            processedTokenCount += 1;
        }
        catch (err) {
            // do nothing with error
            console.log(err);
        }
    }
    const openAddress = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, spl_token_collective_1.SplTokenCollective.OPEN_COLLECTIVE_MINT_ID, tokenBondingSdk.wallet.publicKey);
    const openBalance = yield tokenBondingSdk.provider.connection.getTokenAccountBalance(openAddress);
    setStatus("Swapping: $OPEN");
    const { instructions } = yield tokenBondingSdk.sellInstructions({
        targetAmount: openBalance.value.uiAmount,
        tokenBonding: spl_token_collective_1.SplTokenCollective.OPEN_COLLECTIVE_BONDING_ID,
        slippage: 0.5,
    });
    const tx = new web3_js_1.Transaction();
    tx.recentBlockhash = (yield tokenBondingSdk.provider.connection.getLatestBlockhash()).blockhash;
    tx.feePayer = tokenBondingSdk.wallet.publicKey;
    tx.add(...instructions);
    closeInstrs.push(yield spl_token_1.Token.createCloseAccountInstruction(spl_token_1.TOKEN_PROGRAM_ID, openAta, tokenBondingSdk.wallet.publicKey, tokenBondingSdk.wallet.publicKey, []));
    const signedTx = yield tokenBondingSdk.wallet.signTransaction(tx);
    yield (0, spl_utils_1.sendAndConfirmWithRetry)(tokenBondingSdk.provider.connection, signedTx.serialize(), {
        skipPreflight: true,
    }, "max");
    setStatus("Closing token accounts");
    yield Promise.all(chunks(closeInstrs, 4).map((closeGroup) => __awaiter(void 0, void 0, void 0, function* () {
        const tx = new web3_js_1.Transaction();
        tx.recentBlockhash = (yield tokenBondingSdk.provider.connection.getLatestBlockhash()).blockhash;
        tx.feePayer = tokenBondingSdk.wallet.publicKey;
        tx.add(...closeGroup);
        // tx.add(
        //   await Token.createCloseAccountInstruction(
        //     TOKEN_PROGRAM_ID,
        //     openAta,
        //     tokenBondingSdk.wallet.publicKey,
        //     tokenBondingSdk.wallet.publicKey,
        //     []
        //   )
        // );
        const signedTx = yield tokenBondingSdk.wallet.signTransaction(tx);
        yield (0, spl_utils_1.sendAndConfirmWithRetry)(tokenBondingSdk.provider.connection, signedTx.serialize(), {
            skipPreflight: true,
        }, "confirmed");
    })));
    if (processedTokenCount == tokens.length) {
        setStatus("successful");
    }
    else {
        setStatus("orphaned");
    }
});
exports.closeOutWumboSubmit = closeOutWumboSubmit;
//# sourceMappingURL=closeOutWumboSubmit.js.map