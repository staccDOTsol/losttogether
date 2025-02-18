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
exports.useTransactions = void 0;
const wallet_adapter_react_1 = require("@solana/wallet-adapter-react");
const accelerator_1 = require("@strata-foundation/accelerator");
const react_1 = require("react");
const acceleratorContext_1 = require("../contexts/acceleratorContext");
const truthy_1 = require("../utils/truthy");
const useEndpoint_1 = require("./useEndpoint");
function getSignatures(connection, address, until, lastSignature, maxSignatures = 1000) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!connection || !address) {
            return [];
        }
        const fetchSize = Math.min(1000, maxSignatures);
        const signatures = yield connection.getSignaturesForAddress(address, {
            before: lastSignature,
            limit: fetchSize,
        });
        const withinTime = signatures.filter((sig) => (sig.blockTime || 0) > ((until === null || until === void 0 ? void 0 : until.valueOf()) || 0) / 1000);
        if (withinTime.length == 1000) {
            return [
                ...withinTime,
                ...(yield getSignatures(connection, address, until, signatures[signatures.length - 1].signature, maxSignatures)),
            ];
        }
        return withinTime;
    });
}
function removeDups(txns) {
    const notPending = new Set(Array.from(txns.filter((tx) => !tx.pending).map((tx) => tx.signature)));
    // Use the block times from pending messages so that there's no weird reording on screen
    const pendingBlockTimes = txns
        .filter((tx) => tx.pending)
        .reduce((acc, tx) => (Object.assign(Object.assign({}, acc), { [tx.signature]: tx.blockTime })), {});
    const seen = new Set();
    return txns
        .map((tx) => {
        const nonPendingAvailable = tx.pending && notPending.has(tx.signature);
        if (!seen.has(tx.signature) && !nonPendingAvailable) {
            tx.blockTime = pendingBlockTimes[tx.signature] || tx.blockTime;
            seen.add(tx.signature);
            return tx;
        }
    })
        .filter(truthy_1.truthy);
}
const useTransactions = ({ numTransactions, until, address, subscribe = false, accelerated = false, lazy = false, }) => {
    const { accelerator } = (0, acceleratorContext_1.useAccelerator)();
    const { cluster } = (0, useEndpoint_1.useEndpoint)();
    const { connection } = (0, wallet_adapter_react_1.useConnection)();
    const [loadingInitial, setLoadingInitial] = (0, react_1.useState)(!lazy);
    const [loadingMore, setLoadingMore] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)();
    const [hasMore, setHasMore] = (0, react_1.useState)(false);
    const [transactions, setTransactions] = (0, react_1.useState)([]);
    const addrStr = (0, react_1.useMemo)(() => address === null || address === void 0 ? void 0 : address.toBase58(), [address]);
    (0, react_1.useEffect)(() => {
        let dispose;
        if (connection && subscribe && address && cluster) {
            dispose = (0, accelerator_1.subscribeTransactions)({
                connection,
                address,
                cluster: cluster,
                accelerator,
                callback: (newTx) => {
                    console.log("tx", newTx);
                    setTransactions((txns) => removeDups([newTx, ...txns]));
                },
            });
        }
        return () => {
            if (dispose) {
                dispose();
            }
        };
    }, [connection, subscribe, address, cluster]);
    (0, react_1.useEffect)(() => {
        setTransactions([]);
        (() => __awaiter(void 0, void 0, void 0, function* () {
            if (!lazy) {
                setLoadingInitial(true);
                try {
                    const signatures = yield getSignatures(connection, address, until, undefined, numTransactions);
                    setHasMore(signatures.length === numTransactions);
                    setTransactions(yield (0, accelerator_1.hydrateTransactions)(connection, signatures));
                }
                catch (e) {
                    setError(e);
                }
                finally {
                    setLoadingInitial(false);
                }
            }
        }))();
    }, [connection, addrStr, until, setTransactions, numTransactions]);
    const fetchMore = (0, react_1.useCallback)((num) => __awaiter(void 0, void 0, void 0, function* () {
        setLoadingMore(true);
        try {
            const lastTx = transactions[transactions.length - 1];
            const signatures = yield getSignatures(connection, address, until, lastTx && lastTx.transaction && lastTx.transaction.signatures[0], num);
            setHasMore(signatures.length === num);
            const newTxns = yield (0, accelerator_1.hydrateTransactions)(connection, signatures);
            setTransactions((txns) => removeDups([...txns, ...newTxns]));
        }
        catch (e) {
            setError(e);
        }
        finally {
            setLoadingMore(false);
        }
    }), [
        transactions[transactions.length - 1],
        connection,
        address,
        until,
        setHasMore,
        setTransactions,
        setError,
        setLoadingMore,
    ]);
    const fetchNew = (0, react_1.useCallback)((num) => __awaiter(void 0, void 0, void 0, function* () {
        setLoadingMore(true);
        try {
            const earlyTx = transactions[0];
            const earlyBlockTime = earlyTx && earlyTx.blockTime;
            let lastDate = until;
            if (earlyBlockTime) {
                const date = new Date(0);
                date.setUTCSeconds(earlyBlockTime);
                lastDate = date;
            }
            const signatures = yield getSignatures(connection, address, lastDate, undefined, num);
            const newTxns = yield (0, accelerator_1.hydrateTransactions)(connection, signatures);
            setTransactions((txns) => removeDups([...newTxns, ...txns]));
        }
        catch (e) {
            setError(e);
        }
        finally {
            setLoadingMore(false);
        }
    }), [
        setLoadingMore,
        setError,
        setTransactions,
        until,
        address,
        transactions[0],
        connection,
    ]);
    return {
        hasMore,
        transactions,
        error,
        loadingInitial,
        loadingMore,
        fetchMore,
        fetchNew,
    };
};
exports.useTransactions = useTransactions;
//# sourceMappingURL=useTransactions.js.map