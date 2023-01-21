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
exports.createCloseInstruction = void 0;
const web3_js_1 = require("@solana/web3.js");
const createUpgradeInstruction_1 = require("./createUpgradeInstruction");
function createCloseInstruction(programId, bufferAddress, upgradeAuthority, recipientAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const bpfUpgradableLoaderId = createUpgradeInstruction_1.BPF_UPGRADE_LOADER_ID;
        const [programDataAddress] = yield web3_js_1.PublicKey.findProgramAddress([programId.toBuffer()], bpfUpgradableLoaderId);
        const keys = [
            {
                pubkey: bufferAddress,
                isWritable: true,
                isSigner: false,
            },
            {
                pubkey: recipientAddress,
                isWritable: true,
                isSigner: false,
            },
            {
                pubkey: upgradeAuthority,
                isWritable: false,
                isSigner: true,
            },
            {
                pubkey: programDataAddress,
                isWritable: false,
                isSigner: false,
            },
            {
                pubkey: web3_js_1.SYSVAR_RENT_PUBKEY,
                isWritable: false,
                isSigner: false,
            }
        ];
        return new web3_js_1.TransactionInstruction({
            keys,
            programId: bpfUpgradableLoaderId,
            data: Buffer.from([5, 0, 0, 0]), // Upgrade instruction bincode
        });
    });
}
exports.createCloseInstruction = createCloseInstruction;
//# sourceMappingURL=createCloseInstruction.js.map