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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FungibleEntangler = void 0;
const anchor = __importStar(require("@project-serum/anchor"));
const spl_token_1 = require("@solana/spl-token");
const web3_js_1 = require("@solana/web3.js");
const spl_utils_1 = require("@strata-foundation/spl-utils");
const bn_js_1 = __importDefault(require("bn.js"));
const utils_1 = require("./utils");
__exportStar(require("./generated/fungible-entangler"), exports);
const truthy = (value) => !!value;
const encode = anchor.utils.bytes.utf8.encode;
class FungibleEntangler extends spl_utils_1.AnchorSdk {
    constructor(provider, program) {
        super({ provider, program });
        this.parentEntanglerDecoder = (pubkey, account) => {
            const coded = this.program.coder.accounts.decode("FungibleParentEntanglerV0", account.data);
            return Object.assign(Object.assign({}, coded), { publicKey: pubkey });
        };
        this.childEntanglerDecoder = (pubkey, account) => {
            try {
                const coded = this.program.coder.accounts.decode("FungibleChildEntanglerV0", account.data);
                return Object.assign(Object.assign({}, coded), { publicKey: pubkey });
            }
            catch (err) {
                return undefined;
            }
        };
    }
    static init(provider, fungibleEntanglerProgramId = FungibleEntangler.ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const FungibleEntanglerIDLJson = yield anchor.Program.fetchIdl(fungibleEntanglerProgramId, provider);
            const fungibleEntangler = new anchor.Program(FungibleEntanglerIDLJson, fungibleEntanglerProgramId, provider);
            return new this(provider, fungibleEntangler);
        });
    }
    /**
     * General utility function to check if an account exists
     * @param account
     * @returns
     */
    accountExists(account) {
        return __awaiter(this, void 0, void 0, function* () {
            return Boolean(yield this.provider.connection.getAccountInfo(account));
        });
    }
    /**
     * Get the PDA key of a Parent Entangler given the mint and dynamicSeed
     *
     *
     * @param mint
     * @param dynamicSeed
     * @returns
     */
    static fungibleParentEntanglerKey(mint, dynamicSeed, programId = FungibleEntangler.ID) {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([encode("entangler"), mint.toBuffer(), dynamicSeed], programId);
        });
    }
    /**
     * Get the PDA key of a Child Entangler given the mint and parentEntangler
     *
     *
     * @param mint
     * @param parentEntangler
     * @returns
     */
    static fungibleChildEntanglerKey(parentEntangler, mint, programId = FungibleEntangler.ID) {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([encode("entangler"), parentEntangler.toBuffer(), mint.toBuffer()], programId);
        });
    }
    /**
     * Get the PDA key of a Entangler storage given the entangler
     *
     *
     * @param entangler
     * @returns
     */
    static storageKey(entangler, programId = FungibleEntangler.ID) {
        return __awaiter(this, void 0, void 0, function* () {
            return web3_js_1.PublicKey.findProgramAddress([encode("storage"), entangler.toBuffer()], programId);
        });
    }
    getParentEntangler(entanglerKey) {
        return this.getAccount(entanglerKey, this.parentEntanglerDecoder);
    }
    getChildEntangler(entanglerKey) {
        return this.getAccount(entanglerKey, this.childEntanglerDecoder);
    }
    getUnixTime() {
        return __awaiter(this, void 0, void 0, function* () {
            const acc = yield this.provider.connection.getAccountInfo(web3_js_1.SYSVAR_CLOCK_PUBKEY);
            return Number(acc.data.readBigInt64LE(8 * 4));
        });
    }
    createFungibleParentEntanglerInstructions({ authority = this.provider.wallet.publicKey, payer = this.provider.wallet.publicKey, source = this.provider.wallet.publicKey, mint, dynamicSeed, amount, goLiveDate, freezeSwapDate, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!goLiveDate) {
                goLiveDate = new Date(0).setUTCSeconds((yield this.getUnixTime()) - 60);
            }
            const mintAcct = yield (0, spl_utils_1.getMintInfo)(this.provider, mint);
            const sourceAcct = yield this.provider.connection.getAccountInfo(source);
            amount = (0, utils_1.toNumber)(amount, mintAcct);
            // Source is a wallet, need to get the ATA
            if (!sourceAcct || sourceAcct.owner.equals(web3_js_1.SystemProgram.programId)) {
                const ataSource = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, payer, true);
                if (!(yield this.accountExists(ataSource))) {
                    throw new Error(`Owner of ${payer === null || payer === void 0 ? void 0 : payer.toBase58()} does not hold any ${mint.toBase58()} tokens`);
                }
                source = ataSource;
            }
            const sourceAcctAta = yield (0, spl_utils_1.getTokenAccount)(this.provider, source);
            const instructions = [];
            const signers = [];
            const [entangler, _entanglerBump] = yield FungibleEntangler.fungibleParentEntanglerKey(mint, dynamicSeed);
            const [storage, _storageBump] = yield FungibleEntangler.storageKey(entangler);
            instructions.push(yield this.instruction.initializeFungibleParentEntanglerV0({
                authority,
                dynamicSeed,
                goLiveUnixTime: new bn_js_1.default(Math.floor(goLiveDate.valueOf() / 1000)),
                freezeSwapUnixTime: freezeSwapDate
                    ? new bn_js_1.default(Math.floor(freezeSwapDate.valueOf() / 1000))
                    : null,
            }, {
                accounts: {
                    payer,
                    entangler,
                    parentStorage: storage,
                    parentMint: mint,
                    tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                    clock: web3_js_1.SYSVAR_CLOCK_PUBKEY,
                },
            }), spl_token_1.Token.createTransferInstruction(spl_token_1.TOKEN_PROGRAM_ID, source, storage, sourceAcctAta.owner, [], new spl_token_1.u64((amount * Math.pow(10, mintAcct.decimals)).toLocaleString("fullwide", {
                useGrouping: false,
            }))));
            return {
                instructions,
                signers,
                output: {
                    entangler,
                    storage,
                    mint,
                },
            };
        });
    }
    createFungibleParentEntangler(args, commitment = "confirmed") {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(this.createFungibleParentEntanglerInstructions(args), args.payer, commitment);
        });
    }
    createFungibleChildEntanglerInstructions({ authority = this.provider.wallet.publicKey, payer = this.provider.wallet.publicKey, parentEntangler, mint, goLiveDate, freezeSwapDate, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructions = [];
            const signers = [];
            if (!goLiveDate) {
                goLiveDate = new Date(0).setUTCSeconds((yield this.getUnixTime()) - 60);
            }
            const [entangler, _entanglerBump] = yield FungibleEntangler.fungibleChildEntanglerKey(parentEntangler, mint);
            const [storage, _storageBump] = yield FungibleEntangler.storageKey(entangler);
            instructions.push(yield this.instruction.initializeFungibleChildEntanglerV0({
                goLiveUnixTime: new bn_js_1.default(Math.floor(goLiveDate.valueOf() / 1000)),
                freezeSwapUnixTime: freezeSwapDate
                    ? new bn_js_1.default(Math.floor(freezeSwapDate.valueOf() / 1000))
                    : null,
            }, {
                accounts: {
                    payer,
                    parentEntangler,
                    entangler,
                    authority: authority,
                    childStorage: storage,
                    childMint: mint,
                    tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    systemProgram: web3_js_1.SystemProgram.programId,
                    rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                    clock: web3_js_1.SYSVAR_CLOCK_PUBKEY,
                },
            }));
            return {
                instructions,
                signers,
                output: {
                    entangler,
                    storage,
                    mint,
                },
            };
        });
    }
    createFungibleChildEntangler(args, commitment = "confirmed") {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(this.createFungibleChildEntanglerInstructions(args), args.payer, commitment);
        });
    }
    createFungibleEntanglerInstructions({ authority = this.provider.wallet.publicKey, payer = this.provider.wallet.publicKey, source = this.provider.wallet.publicKey, dynamicSeed = web3_js_1.Keypair.generate().publicKey.toBuffer(), amount, parentMint, childMint, parentGoLiveDate, parentFreezeSwapDate, childGoLiveDate, childFreezeSwapDate, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructions = [];
            const signers = [];
            if (!parentGoLiveDate) {
                parentGoLiveDate = new Date(0).setUTCSeconds((yield this.getUnixTime()) - 60);
            }
            if (!childGoLiveDate) {
                childGoLiveDate = new Date(0).setUTCSeconds((yield this.getUnixTime()) - 60);
            }
            const { instructions: parentInstructions, signers: parentSigners, output: parentOutput, } = yield this.createFungibleParentEntanglerInstructions({
                authority,
                payer,
                source,
                dynamicSeed,
                amount,
                mint: parentMint,
                goLiveDate: parentGoLiveDate,
                freezeSwapDate: parentFreezeSwapDate,
            });
            const { instructions: childInstructions, signers: childSigners, output: childOutput, } = yield this.createFungibleChildEntanglerInstructions({
                authority,
                payer,
                parentEntangler: parentOutput.entangler,
                mint: childMint,
                goLiveDate: childGoLiveDate,
                freezeSwapDate: childFreezeSwapDate,
            });
            instructions.push(...parentInstructions, ...childInstructions);
            return {
                instructions,
                signers,
                output: {
                    parentEntangler: parentOutput.entangler,
                    parentStorage: parentOutput.storage,
                    parentMint: parentOutput.mint,
                    childEntangler: childOutput.entangler,
                    childStorage: childOutput.storage,
                    childMint: childOutput.mint,
                },
            };
        });
    }
    createFungibleEntangler(args, commitment = "confirmed") {
        return __awaiter(this, void 0, void 0, function* () {
            return this.execute(this.createFungibleEntanglerInstructions(args), args.payer, commitment);
        });
    }
    swapParentForChildInstructions(_a) {
        var { payer = this.wallet.publicKey, source, sourceAuthority = this.wallet.publicKey, parentEntangler, childEntangler, destination } = _a, rest = __rest(_a, ["payer", "source", "sourceAuthority", "parentEntangler", "childEntangler", "destination"]);
        return __awaiter(this, void 0, void 0, function* () {
            let { amount, all } = Object.assign({ amount: null, all: null }, rest);
            const parentAcct = (yield this.getParentEntangler(parentEntangler));
            const childAcct = (yield this.getChildEntangler(childEntangler));
            const parentMint = yield (0, spl_utils_1.getMintInfo)(this.provider, parentAcct.parentMint);
            const instructions = [];
            const signers = [];
            if (!destination) {
                destination = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, childAcct.childMint, sourceAuthority, true);
                if (!(yield this.accountExists(destination))) {
                    console.log(`Creating child ${childAcct.childMint.toBase58()} account`);
                    instructions.push(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, childAcct.childMint, destination, sourceAuthority, payer));
                }
            }
            if (!source) {
                source = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, parentAcct.parentMint, sourceAuthority, true);
                if (!(yield this.accountExists(source))) {
                    console.warn("Source account for swap does not exist, if it is not created in an earlier instruction this can cause an error");
                }
            }
            if (amount) {
                amount = (0, utils_1.toBN)(amount, parentMint);
            }
            const args = {
                // @ts-ignore
                amount,
                // @ts-ignore
                all,
            };
            instructions.push(yield this.instruction.swapParentForChildV0(args, {
                accounts: {
                    common: {
                        parentEntangler,
                        parentStorage: parentAcct.parentStorage,
                        childEntangler,
                        childStorage: childAcct.childStorage,
                        source,
                        sourceAuthority,
                        destination,
                        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                        clock: web3_js_1.SYSVAR_CLOCK_PUBKEY,
                    },
                },
            }));
            return {
                instructions,
                signers,
                output: null,
            };
        });
    }
    swapParentForChild(args, commitment = "confirmed") {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute(this.swapParentForChildInstructions(args), args.payer, commitment);
        });
    }
    swapChildForParentInstructions(_a) {
        var { payer = this.wallet.publicKey, source, sourceAuthority = this.wallet.publicKey, parentEntangler, childEntangler, destination } = _a, rest = __rest(_a, ["payer", "source", "sourceAuthority", "parentEntangler", "childEntangler", "destination"]);
        return __awaiter(this, void 0, void 0, function* () {
            let { amount, all } = Object.assign({ amount: null, all: null }, rest);
            const parentAcct = (yield this.getParentEntangler(parentEntangler));
            const childAcct = (yield this.getChildEntangler(childEntangler));
            const childMint = yield (0, spl_utils_1.getMintInfo)(this.provider, childAcct.childMint);
            const instructions = [];
            const signers = [];
            if (!destination) {
                destination = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, parentAcct.parentMint, sourceAuthority, true);
                if (!(yield this.accountExists(destination))) {
                    console.log(`Creating parent ${parentAcct.parentMint.toBase58()} account`);
                    instructions.push(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, parentAcct.parentMint, destination, sourceAuthority, payer));
                }
            }
            if (amount) {
                amount = (0, utils_1.toBN)(amount, childMint);
            }
            if (!source) {
                source = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, childAcct.childMint, sourceAuthority, true);
                if (!(yield this.accountExists(source))) {
                    console.warn("Source account for swap does not exist, if it is not created in an earlier instruction this can cause an error");
                }
            }
            const args = {
                // @ts-ignore
                amount,
                // @ts-ignore
                all,
            };
            instructions.push(yield this.instruction.swapChildForParentV0(args, {
                accounts: {
                    common: {
                        parentEntangler,
                        parentStorage: parentAcct.parentStorage,
                        childEntangler,
                        childStorage: childAcct.childStorage,
                        source,
                        sourceAuthority,
                        destination,
                        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                        clock: web3_js_1.SYSVAR_CLOCK_PUBKEY,
                    },
                },
            }));
            return {
                instructions,
                signers,
                output: null,
            };
        });
    }
    swapChildForParent(args, commitment = "confirmed") {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute(this.swapChildForParentInstructions(args), args.payer, commitment);
        });
    }
    topOffInstructions(_a) {
        var { payer = this.wallet.publicKey, source, sourceAuthority = this.wallet.publicKey, amount } = _a, rest = __rest(_a, ["payer", "source", "sourceAuthority", "amount"]);
        return __awaiter(this, void 0, void 0, function* () {
            const { parentEntangler, childEntangler } = Object.assign({ parentEntangler: null, childEntangler: null }, rest);
            const entanglerAcct = parentEntangler
                ? yield this.getParentEntangler(parentEntangler)
                : yield this.getChildEntangler(childEntangler);
            const mint = parentEntangler
                ? entanglerAcct.parentMint
                : entanglerAcct.childMint;
            const mintAcct = yield (0, spl_utils_1.getMintInfo)(this.provider, mint);
            const instructions = [];
            const signers = [];
            if (!source) {
                source = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, sourceAuthority, true);
                if (!(yield this.accountExists(source))) {
                    console.warn("Source account for swap does not exist, if it is not created in an earlier instruction this can cause an error");
                }
            }
            const sourceAcctAta = yield (0, spl_utils_1.getTokenAccount)(this.provider, source);
            amount = (0, utils_1.toNumber)(amount, mintAcct);
            instructions.push(spl_token_1.Token.createTransferInstruction(spl_token_1.TOKEN_PROGRAM_ID, source, parentEntangler
                ? entanglerAcct.parentStorage
                : entanglerAcct.childStorage, sourceAcctAta.owner, [], new spl_token_1.u64((amount * Math.pow(10, mintAcct.decimals)).toLocaleString("fullwide", {
                useGrouping: false,
            }))));
            return {
                instructions,
                signers,
                output: null,
            };
        });
    }
    topOff(args, commitment = "confirmed") {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute(this.topOffInstructions(args), args.payer, commitment);
        });
    }
    transferInstructions(_a) {
        var { payer = this.wallet.publicKey, amount, destination, destinationWallet = this.wallet.publicKey } = _a, rest = __rest(_a, ["payer", "amount", "destination", "destinationWallet"]);
        return __awaiter(this, void 0, void 0, function* () {
            let { parentEntangler, childEntangler } = Object.assign({ parentEntangler: null, childEntangler: null }, rest);
            const isTransferChild = childEntangler !== null;
            const childEntanglerAcct = childEntangler
                ? yield this.getChildEntangler(childEntangler)
                : null;
            parentEntangler = (parentEntangler ||
                (childEntanglerAcct && childEntanglerAcct.parentEntangler));
            const parentEntanglerAcct = yield this.getParentEntangler(parentEntangler);
            const mint = isTransferChild
                ? childEntanglerAcct.childMint
                : parentEntanglerAcct.parentMint;
            const mintAcct = yield (0, spl_utils_1.getMintInfo)(this.provider, mint);
            const instructions = [];
            const signers = [];
            const destAcct = destination &&
                (yield this.provider.connection.getAccountInfo(destination));
            // Destination is a wallet, need to get the ATA
            if (!destAcct || destAcct.owner.equals(web3_js_1.SystemProgram.programId)) {
                const ataDestination = yield spl_token_1.Token.getAssociatedTokenAddress(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, destinationWallet, false // Explicitly don't allow owner off curve. You need to pass destination as an already created thing to do this
                );
                if (!(yield this.accountExists(ataDestination))) {
                    instructions.push(spl_token_1.Token.createAssociatedTokenAccountInstruction(spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_1.TOKEN_PROGRAM_ID, mint, ataDestination, destinationWallet, payer));
                }
                destination = ataDestination;
            }
            if (isTransferChild) {
                instructions.push(yield this.instruction.transferChildStorageV0({
                    amount: (0, utils_1.toBN)(amount, mintAcct),
                }, {
                    accounts: {
                        authority: parentEntanglerAcct.authority,
                        parentEntangler,
                        entangler: childEntangler,
                        childStorage: childEntanglerAcct.childStorage,
                        destination: destination,
                        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                }));
            }
            else {
                instructions.push(yield this.instruction.transferParentStorageV0({
                    amount: (0, utils_1.toBN)(amount, mintAcct),
                }, {
                    accounts: {
                        authority: parentEntanglerAcct.authority,
                        parentEntangler,
                        parentStorage: parentEntanglerAcct.parentStorage,
                        destination: destination,
                        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                }));
            }
            return {
                instructions,
                signers,
                output: null,
            };
        });
    }
    transfer(args, commitment = "confirmed") {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute(this.transferInstructions(args), args.payer, commitment);
        });
    }
    closeInstructions(_a) {
        var { refund = this.wallet.publicKey } = _a, rest = __rest(_a, ["refund"]);
        return __awaiter(this, void 0, void 0, function* () {
            let { parentEntangler, childEntangler } = Object.assign({ parentEntangler: null, childEntangler: null }, rest);
            const isCloseChild = childEntangler !== null;
            const childEntanglerAcct = childEntangler
                ? yield this.getChildEntangler(childEntangler)
                : null;
            parentEntangler = (parentEntangler ||
                (childEntanglerAcct && childEntanglerAcct.parentEntangler));
            const parentEntanglerAcct = yield this.getParentEntangler(parentEntangler);
            const mint = isCloseChild
                ? childEntanglerAcct.childMint
                : parentEntanglerAcct.parentMint;
            const instructions = [];
            const signers = [];
            if (isCloseChild) {
                instructions.push(yield this.instruction.closeFungibleChildEntanglerV0({
                    accounts: {
                        refund,
                        authority: parentEntanglerAcct.authority,
                        parentEntangler,
                        entangler: childEntangler,
                        childStorage: childEntanglerAcct.childStorage,
                        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                }));
            }
            else {
                instructions.push(yield this.instruction.closeFungibleParentEntanglerV0({
                    accounts: {
                        refund,
                        authority: parentEntanglerAcct.authority,
                        parentEntangler,
                        parentStorage: parentEntanglerAcct.parentStorage,
                        tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
                    },
                }));
            }
            return {
                instructions,
                signers,
                output: null,
            };
        });
    }
    close(args, commitment = "confirmed") {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.execute(this.closeInstructions(args), args.refund, commitment);
        });
    }
}
exports.FungibleEntangler = FungibleEntangler;
FungibleEntangler.ID = new web3_js_1.PublicKey("fent99TYZcj9PGbeooaZXEMQzMd7rz8vYFiudd8HevB");
//# sourceMappingURL=index.js.map