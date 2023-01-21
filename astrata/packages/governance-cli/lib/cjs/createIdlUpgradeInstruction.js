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
exports.createIdlUpgradeInstruction = void 0;
const web3_js_1 = require("@solana/web3.js");
const idl_1 = require("@project-serum/anchor/dist/cjs/idl");
function createIdlUpgradeInstruction(programId, bufferAddress, upgradeAuthority) {
    return __awaiter(this, void 0, void 0, function* () {
        const prefix = Buffer.from("0a69e9a778bcf440", "hex");
        const ixn = Buffer.from("03", "hex");
        const data = Buffer.concat([prefix.reverse(), ixn]);
        const idlAddr = yield (0, idl_1.idlAddress)(programId);
        const keys = [
            {
                pubkey: bufferAddress,
                isWritable: true,
                isSigner: false,
            },
            {
                pubkey: idlAddr,
                isWritable: true,
                isSigner: false,
            },
            {
                pubkey: upgradeAuthority,
                isWritable: true,
                isSigner: true,
            },
        ];
        return new web3_js_1.TransactionInstruction({
            keys,
            programId,
            data,
        });
    });
}
exports.createIdlUpgradeInstruction = createIdlUpgradeInstruction;
//# sourceMappingURL=createIdlUpgradeInstruction.js.map