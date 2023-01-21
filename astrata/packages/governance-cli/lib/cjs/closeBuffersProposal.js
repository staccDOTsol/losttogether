#! /usr/bin/env node
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
exports.chunks = void 0;
const spl_governance_1 = require("@solana/spl-governance");
const web3_js_1 = require("@solana/web3.js");
const spl_utils_1 = require("@strata-foundation/spl-utils");
const bs58_1 = __importDefault(require("bs58"));
require("./borshFill");
const createCloseInstruction_1 = require("./createCloseInstruction");
const GOVERNANCE_PROGRAM_ID = new web3_js_1.PublicKey("GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw");
const chunks = (array, size) => Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) => array.slice(index * size, (index + 1) * size));
exports.chunks = chunks;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const programId = new web3_js_1.PublicKey(process.env.PROGRAM_ID);
        const governanceKey = new web3_js_1.PublicKey(process.env.GOVERNANCE_KEY);
        const network = process.env.NETWORK;
        const signatory = process.env.SIGNATORY && new web3_js_1.PublicKey(process.env.SIGNATORY);
        const wallet = web3_js_1.Keypair.fromSecretKey(Buffer.from(JSON.parse(require("fs").readFileSync(process.env.WALLET, {
            encoding: "utf-8",
        }))));
        const connection = new web3_js_1.Connection(network.startsWith("http") ? network : (0, web3_js_1.clusterApiUrl)(network));
        const buffers = (yield connection.getProgramAccounts(spl_governance_1.BPF_UPGRADE_LOADER_ID, {
            dataSlice: {
                length: 0,
                offset: 0,
            },
            filters: [
                {
                    memcmp: {
                        offset: 0,
                        bytes: bs58_1.default.encode(Buffer.from(new Uint8Array([1, 0, 0, 0]))),
                    },
                },
                {
                    memcmp: {
                        offset: 4,
                        bytes: bs58_1.default.encode(Buffer.from(new Uint8Array([1]))),
                    },
                },
                {
                    memcmp: {
                        offset: 5,
                        bytes: bs58_1.default.encode(governanceKey.toBuffer()),
                    },
                },
            ],
        })).map((b) => b.pubkey);
        const tx = new web3_js_1.Transaction();
        let instructions = [];
        const info = yield connection.getAccountInfo(governanceKey);
        const gov = (0, spl_governance_1.GovernanceAccountParser)(spl_governance_1.Governance)(governanceKey, info).account;
        const realmKey = gov.realm;
        const realmInfo = yield connection.getAccountInfo(realmKey);
        const realm = (0, spl_governance_1.GovernanceAccountParser)(spl_governance_1.Realm)(governanceKey, realmInfo).account;
        web3_js_1.PublicKey.prototype.toString = web3_js_1.PublicKey.prototype.toBase58;
        const tokenOwner = yield (0, spl_governance_1.getTokenOwnerRecordAddress)(GOVERNANCE_PROGRAM_ID, realmKey, realm.communityMint, wallet.publicKey);
        console.log(tokenOwner.toBase58());
        const version = yield (0, spl_governance_1.getGovernanceProgramVersion)(connection, GOVERNANCE_PROGRAM_ID);
        const proposal = yield (0, spl_governance_1.withCreateProposal)(instructions, GOVERNANCE_PROGRAM_ID, version, realmKey, governanceKey, tokenOwner, "Close all buffers", "Close all program buffers", realm.communityMint, wallet.publicKey, gov.proposalCount, spl_governance_1.VoteType.SINGLE_CHOICE, ["Approve"], true, wallet.publicKey);
        // If signatory provided, add it. Otherwise add ourselves and sign off immediately
        const signatoryRecord = yield (0, spl_governance_1.withAddSignatory)(instructions, GOVERNANCE_PROGRAM_ID, 1, proposal, tokenOwner, wallet.publicKey, signatory ? signatory : wallet.publicKey, wallet.publicKey);
        tx.add(...instructions);
        tx.recentBlockhash = (yield connection.getRecentBlockhash()).blockhash;
        tx.sign(wallet);
        yield (0, spl_utils_1.sendAndConfirmWithRetry)(connection, tx.serialize(), {
            skipPreflight: true,
        }, "confirmed");
        const ixs = (0, exports.chunks)(yield Promise.all(buffers.map((bufferKey) => __awaiter(this, void 0, void 0, function* () {
            const upgradeIx = yield (0, createCloseInstruction_1.createCloseInstruction)(programId, bufferKey, governanceKey, wallet.publicKey);
            return new spl_governance_1.InstructionData({
                programId: upgradeIx.programId,
                accounts: upgradeIx.keys.map((key) => new spl_governance_1.AccountMetaData(key)),
                data: upgradeIx.data,
            });
        }))), 1 // TODO: When multiple commands supported change this
        );
        for (const [index, ixGroup] of ixs.entries()) {
            const tx2 = new web3_js_1.Transaction();
            tx2.recentBlockhash = (yield connection.getRecentBlockhash()).blockhash;
            const instructions = [];
            yield (0, spl_governance_1.withInsertTransaction)(instructions, GOVERNANCE_PROGRAM_ID, version, governanceKey, proposal, tokenOwner, wallet.publicKey, index, 0, 0, ixGroup, wallet.publicKey);
            tx2.add(...instructions);
            tx2.sign(wallet);
            yield (0, spl_utils_1.sendAndConfirmWithRetry)(connection, tx2.serialize(), {
                skipPreflight: true,
            }, "confirmed");
        }
        if (!signatory) {
            const tx2 = new web3_js_1.Transaction();
            tx2.recentBlockhash = (yield connection.getRecentBlockhash()).blockhash;
            instructions = [];
            yield (0, spl_governance_1.withSignOffProposal)(instructions, GOVERNANCE_PROGRAM_ID, version, realmKey, governanceKey, proposal, wallet.publicKey, signatoryRecord, undefined);
            tx2.add(...instructions);
            tx2.sign(wallet);
            yield (0, spl_utils_1.sendAndConfirmWithRetry)(connection, tx2.serialize(), {
                skipPreflight: true,
            }, "confirmed");
        }
        // await sendAndConfirmTransaction(connection, tx, [wallet]);
        console.log(proposal.toBase58());
    });
}
run().catch((e) => {
    console.error(e);
    console.error(e.stack);
    process.exit(1);
});
//# sourceMappingURL=closeBuffersProposal.js.map