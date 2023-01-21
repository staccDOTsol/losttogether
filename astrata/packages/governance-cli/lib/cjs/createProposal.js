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
Object.defineProperty(exports, "__esModule", { value: true });
const spl_governance_1 = require("@solana/spl-governance");
const web3_js_1 = require("@solana/web3.js");
require("./borshFill");
const createIdlUpgradeInstruction_1 = require("./createIdlUpgradeInstruction");
const createUpgradeInstruction_1 = require("./createUpgradeInstruction");
const GOVERNANCE_PROGRAM_ID = new web3_js_1.PublicKey("GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const programId = new web3_js_1.PublicKey(process.env.PROGRAM_ID);
        const bufferKey = new web3_js_1.PublicKey(process.env.BUFFER);
        const idlBufferKey = process.env.IDL_BUFFER && new web3_js_1.PublicKey(process.env.IDL_BUFFER);
        const governanceKey = new web3_js_1.PublicKey(process.env.GOVERNANCE_KEY);
        const network = process.env.NETWORK;
        const signatory = process.env.SIGNATORY && new web3_js_1.PublicKey(process.env.SIGNATORY);
        const wallet = web3_js_1.Keypair.fromSecretKey(Buffer.from(JSON.parse(require("fs").readFileSync(process.env.WALLET, {
            encoding: "utf-8",
        }))));
        const connection = new web3_js_1.Connection(network.startsWith("http") ? network : (0, web3_js_1.clusterApiUrl)(network), {});
        const tx = new web3_js_1.Transaction();
        const instructions = [];
        const info = yield connection.getAccountInfo(governanceKey);
        const gov = (0, spl_governance_1.GovernanceAccountParser)(spl_governance_1.Governance)(governanceKey, info).account;
        const realmKey = gov.realm;
        const realmInfo = yield connection.getAccountInfo(realmKey);
        const realm = (0, spl_governance_1.GovernanceAccountParser)(spl_governance_1.Realm)(governanceKey, realmInfo).account;
        web3_js_1.PublicKey.prototype.toString = web3_js_1.PublicKey.prototype.toBase58;
        const tokenOwner = yield (0, spl_governance_1.getTokenOwnerRecordAddress)(GOVERNANCE_PROGRAM_ID, realmKey, realm.communityMint, wallet.publicKey);
        console.log(tokenOwner.toBase58());
        const version = yield (0, spl_governance_1.getGovernanceProgramVersion)(connection, GOVERNANCE_PROGRAM_ID);
        const proposal = yield (0, spl_governance_1.withCreateProposal)(instructions, GOVERNANCE_PROGRAM_ID, version, realmKey, governanceKey, tokenOwner, process.env.NAME, process.env.DESCRIPTION, realm.communityMint, wallet.publicKey, gov.proposalCount, spl_governance_1.VoteType.SINGLE_CHOICE, ["Approve"], true, wallet.publicKey);
        // If signatory provided, add it. Otherwise add ourselves and sign off immediately
        const signatoryRecord = yield (0, spl_governance_1.withAddSignatory)(instructions, GOVERNANCE_PROGRAM_ID, 1, proposal, tokenOwner, wallet.publicKey, signatory ? signatory : wallet.publicKey, wallet.publicKey);
        const upgradeIx = yield (0, createUpgradeInstruction_1.createUpgradeInstruction)(programId, bufferKey, governanceKey, wallet.publicKey);
        let upgradeIdlIx = null;
        if (idlBufferKey) {
            upgradeIdlIx = yield (0, createIdlUpgradeInstruction_1.createIdlUpgradeInstruction)(programId, idlBufferKey, governanceKey);
        }
        yield (0, spl_governance_1.withInsertTransaction)(instructions, GOVERNANCE_PROGRAM_ID, version, governanceKey, proposal, tokenOwner, wallet.publicKey, 0, 0, 0, [
            new spl_governance_1.InstructionData({
                programId: upgradeIx.programId,
                accounts: upgradeIx.keys.map((key) => new spl_governance_1.AccountMetaData(key)),
                data: upgradeIx.data,
            }),
        ], wallet.publicKey);
        // TODO: Do these both in one command when UI supports it
        if (upgradeIdlIx) {
            yield (0, spl_governance_1.withInsertTransaction)(instructions, GOVERNANCE_PROGRAM_ID, version, governanceKey, proposal, tokenOwner, wallet.publicKey, 1, 0, 0, [
                new spl_governance_1.InstructionData({
                    programId: upgradeIdlIx.programId,
                    accounts: upgradeIdlIx.keys.map((key) => new spl_governance_1.AccountMetaData(key)),
                    data: upgradeIdlIx.data,
                }),
            ], wallet.publicKey);
        }
        if (!signatory) {
            yield (0, spl_governance_1.withSignOffProposal)(instructions, GOVERNANCE_PROGRAM_ID, version, realmKey, governanceKey, proposal, wallet.publicKey, signatoryRecord, undefined);
        }
        tx.add(...instructions);
        tx.recentBlockhash = (yield connection.getRecentBlockhash()).blockhash;
        tx.sign(wallet);
        console.log(yield connection.sendRawTransaction(tx.serialize(), { skipPreflight: true }));
        // await sendAndConfirmTransaction(connection, tx, [wallet]);
        console.log(proposal.toBase58());
    });
}
run().catch((e) => {
    console.error(e);
    console.error(e.stack);
    process.exit(1);
});
//# sourceMappingURL=createProposal.js.map