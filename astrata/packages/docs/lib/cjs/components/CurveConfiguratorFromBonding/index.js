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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveConfiguratorFromBonding = void 0;
const react_1 = require("@strata-foundation/react");
const variables_1 = require("../../theme/Root/variables");
const react_2 = __importStar(require("react"));
const CurveConfigurator_1 = require("../CurveConfigurator");
const spl_utils_1 = require("@strata-foundation/spl-utils");
const react_3 = require("react");
const react_4 = require("@chakra-ui/react");
function CurveConfiguratorFromBonding({ priceVsSupply = true, priceVsTime = true, rateVsTime = false, salesVsTime = false, }) {
    const { tokenBondingKey: inputTokenBondingKey, id } = (0, variables_1.useVariables)();
    const { tokenBonding } = (0, react_1.useTokenSwapFromId)(id);
    const tokenBondingKey = (0, react_3.useMemo)(() => inputTokenBondingKey || (tokenBonding === null || tokenBonding === void 0 ? void 0 : tokenBonding.publicKey), [tokenBonding, inputTokenBondingKey]);
    const { info: tokenBondingAcct } = (0, react_1.useTokenBonding)(tokenBondingKey);
    const { info: curve } = (0, react_1.useCurve)(tokenBondingAcct === null || tokenBondingAcct === void 0 ? void 0 : tokenBondingAcct.curve);
    const baseMint = (0, react_1.useMint)(tokenBondingAcct === null || tokenBondingAcct === void 0 ? void 0 : tokenBondingAcct.baseMint);
    const targetMint = (0, react_1.useMint)(tokenBondingAcct === null || tokenBondingAcct === void 0 ? void 0 : tokenBondingAcct.targetMint);
    const [timeOffset, setTimeOffset] = (0, react_2.useState)();
    const [reserves, setReserves] = (0, react_2.useState)();
    const [supply, setSupply] = (0, react_2.useState)();
    const [startSupply, setStartSupply] = (0, react_2.useState)();
    const [endSupply, setEndSupply] = (0, react_2.useState)();
    const [maxTime, setMaxTime] = (0, react_2.useState)();
    const unixTime = (0, react_1.useSolanaUnixTime)();
    const bondTimeOffset = (0, react_3.useMemo)(() => {
        return (tokenBondingAcct &&
            unixTime &&
            Math.max(unixTime - tokenBondingAcct.goLiveUnixTime.toNumber(), 0));
    }, [unixTime, tokenBondingAcct]);
    const bondReserves = (0, react_3.useMemo)(() => {
        return (tokenBondingAcct &&
            baseMint &&
            (0, spl_utils_1.toNumber)(tokenBondingAcct.reserveBalanceFromBonding, baseMint).toString());
    }, [tokenBondingAcct, baseMint]);
    const bondSupply = (0, react_3.useMemo)(() => {
        return (tokenBondingAcct &&
            targetMint &&
            (0, spl_utils_1.toNumber)(tokenBondingAcct.supplyFromBonding, targetMint).toString());
    }, [tokenBondingAcct, targetMint]);
    const bondStartSupply = 0;
    const bondEndSupply = tokenBondingAcct === null || tokenBondingAcct === void 0 ? void 0 : tokenBondingAcct.mintCap;
    const bondMaxTime = (0, react_3.useMemo)(() => {
        // @ts-ignore
        return curve === null || curve === void 0 ? void 0 : curve.definition.timeV0.curves[0].curve.timeDecayExponentialCurveV0.interval;
    }, [curve]);
    const numCharts = +priceVsSupply + +priceVsTime + +rateVsTime;
    const supplyOffset = (0, react_3.useMemo)(() => {
        if (tokenBondingAcct && targetMint) {
            return (0, spl_utils_1.toNumber)(tokenBondingAcct.supplyFromBonding.sub(targetMint.supply), targetMint);
        }
    }, [tokenBondingAcct, targetMint]);
    if (!bondTimeOffset ||
        !bondReserves ||
        !bondSupply ||
        !bondEndSupply ||
        !bondMaxTime ||
        !curve) {
        return react_2.default.createElement(react_4.Box, null, "Loading...");
    }
    const args = {
        timeOffset: timeOffset || (bondTimeOffset === null || bondTimeOffset === void 0 ? void 0 : bondTimeOffset.toString()),
        setTimeOffset,
        reserves: reserves || bondReserves,
        setReserves,
        supply: supply || bondSupply,
        setSupply,
        startSupply: startSupply || bondStartSupply.toString(),
        setStartSupply,
        endSupply: endSupply || (bondEndSupply === null || bondEndSupply === void 0 ? void 0 : bondEndSupply.toString()),
        setEndSupply,
        maxTime: maxTime || bondMaxTime.toString(),
        setMaxTime,
    };
    return (react_2.default.createElement(react_4.VStack, { w: "full" },
        react_2.default.createElement(react_4.SimpleGrid, { columns: 3, w: "full" },
            react_2.default.createElement(react_4.VStack, null,
                react_2.default.createElement("label", null, "Reserves"),
                react_2.default.createElement(react_4.Input, { type: "number", step: 0.001, onChange: (e) => setReserves(e.target.value), value: args.reserves })),
            react_2.default.createElement(react_4.VStack, null,
                react_2.default.createElement("label", null, "Supply"),
                react_2.default.createElement(react_4.Input, { type: "number", step: 0.001, onChange: (e) => setSupply(e.target.value), value: args.supply })),
            react_2.default.createElement(react_4.VStack, null,
                react_2.default.createElement("label", null, "Seconds since Launch"),
                react_2.default.createElement(react_4.Input, { type: "number", step: 1, onChange: (e) => setTimeOffset(e.target.value), value: args.timeOffset })),
            react_2.default.createElement(react_4.VStack, null,
                react_2.default.createElement("label", null, "Start Supply"),
                react_2.default.createElement(react_4.Input, { type: "number", step: 0.001, onChange: (e) => setStartSupply(e.target.value), value: args.startSupply })),
            react_2.default.createElement(react_4.VStack, null,
                react_2.default.createElement("label", null, "End Supply"),
                react_2.default.createElement(react_4.Input, { type: "number", step: 0.001, onChange: (e) => setEndSupply(e.target.value), value: args.endSupply })),
            react_2.default.createElement(react_4.VStack, null,
                react_2.default.createElement("label", null, "Max Time"),
                react_2.default.createElement(react_4.Input, { type: "number", step: 1, onChange: (e) => setMaxTime(e.target.value), value: args.maxTime }))),
        react_2.default.createElement(react_4.SimpleGrid, { columns: [1, 1, 1, 1, Math.min(numCharts, 2)], w: "full" },
            priceVsSupply && (react_2.default.createElement(CurveConfigurator_1.PriceVsSupplyDisplay, Object.assign({ supplyOffset: supplyOffset || 0, curveConfig: curve }, args))),
            priceVsTime && (react_2.default.createElement(CurveConfigurator_1.PriceVsTimeDisplay, Object.assign({ curveConfig: curve }, args))),
            rateVsTime && (react_2.default.createElement(CurveConfigurator_1.RateVsTimeDisplay, Object.assign({ curveConfig: curve }, args))),
            salesVsTime && (react_2.default.createElement(CurveConfigurator_1.EstimatedSalesVsTime, Object.assign({ curveConfig: curve }, args))))));
}
exports.CurveConfiguratorFromBonding = CurveConfiguratorFromBonding;
//# sourceMappingURL=index.js.map