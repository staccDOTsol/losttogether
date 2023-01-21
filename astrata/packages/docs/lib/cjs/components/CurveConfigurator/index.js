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
exports.CurveConfiguratorFromVariables = exports.PriceVsTimeDisplay = exports.EstimatedSalesVsTime = exports.RateVsTimeDisplay = exports.PriceVsSupplyDisplay = void 0;
const react_1 = __importStar(require("react"));
const spl_token_bonding_1 = require("@strata-foundation/spl-token-bonding");
const react_2 = require("@strata-foundation/react");
const react_3 = require("@chakra-ui/react");
const recharts_1 = require("recharts");
const variables_1 = require("../../theme/Root/variables");
const NUM_DATAPOINTS = 40;
const PriceVsSupplyDisplay = ({ curveConfig, timeOffset, setTimeOffset, reserves, setReserves, startSupply, setStartSupply, endSupply, setEndSupply, setSupply, supply, supplyOffset, }) => {
    const startSupplyNum = Number(startSupply) + supplyOffset;
    const endSupplyNum = Number(endSupply) + supplyOffset;
    const supplyNum = Number(supply);
    const data = (0, react_1.useMemo)(() => {
        const beforeCurrPoint = [];
        const step = (endSupplyNum - startSupplyNum) / NUM_DATAPOINTS;
        if (step <= 0) {
            return [];
        }
        let tempReserves = Number(reserves);
        for (let i = supplyNum; i > startSupplyNum; i -= step) {
            const currPricing = (0, spl_token_bonding_1.fromCurve)(curveConfig, tempReserves, i, 0);
            const decr = currPricing.sellTargetAmount(step, 0, 0, Number(timeOffset));
            tempReserves -= decr;
            const price = (0, spl_token_bonding_1.fromCurve)(curveConfig, tempReserves, i - step, 0).buyTargetAmount(1, 0, 0, Number(timeOffset));
            if (i - step >= 0 && price > 0) {
                beforeCurrPoint.push({
                    supply: i - step,
                    price,
                    total: tempReserves,
                });
            }
        }
        const afterCurrPoint = [];
        let tempReserves2 = Number(reserves);
        if (startSupplyNum > supplyNum) {
            tempReserves2 =
                tempReserves2 +
                    (0, spl_token_bonding_1.fromCurve)(curveConfig, tempReserves2, Number(supply), 0).buyTargetAmount(startSupplyNum - supplyNum, 0, 0, Number(timeOffset));
        }
        for (let i = Math.max(supplyNum, startSupplyNum); i <= endSupplyNum; i += step) {
            const currPricing = (0, spl_token_bonding_1.fromCurve)(curveConfig, tempReserves2, i, 0);
            const price = currPricing.buyTargetAmount(1, 0, 0, Number(timeOffset));
            const incr = currPricing.buyTargetAmount(step, 0, 0, Number(timeOffset));
            afterCurrPoint.push({
                supply: i,
                price,
                total: tempReserves2,
            });
            tempReserves2 += incr;
        }
        return [...beforeCurrPoint.reverse(), ...afterCurrPoint];
    }, [startSupply, curveConfig, reserves, supply, timeOffset, endSupply]);
    return (react_1.default.createElement(react_3.VStack, { justify: "stretch" },
        react_1.default.createElement(react_3.Box, { w: "full", h: "500px" },
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
                react_1.default.createElement(recharts_1.LineChart, { width: 500, height: 300, data: data, margin: {
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    } },
                    react_1.default.createElement(recharts_1.ReferenceLine, { x: Number(supply), stroke: "orange" }),
                    react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }),
                    react_1.default.createElement(recharts_1.XAxis, { tickFormatter: (amount) => Math.floor(amount - supplyOffset).toString(), tickCount: 10, type: "number", dataKey: "supply", label: { value: "Supply", dy: 10 }, domain: [startSupplyNum, endSupplyNum] }),
                    react_1.default.createElement(recharts_1.YAxis, { type: "number", label: {
                            value: "Price",
                            position: "insideLeft",
                            angle: -90,
                            dy: 0,
                        } }),
                    react_1.default.createElement(recharts_1.Tooltip, null),
                    react_1.default.createElement(recharts_1.Legend, null),
                    react_1.default.createElement(recharts_1.Line, { activeDot: {
                            onClick: (e, payload) => {
                                //@ts-ignore
                                setSupply(payload.payload.supply);
                                //@ts-ignore
                                setReserves(payload.payload.total);
                            },
                        }, type: "monotone", dataKey: "price", stroke: "#8884d8" }))))));
};
exports.PriceVsSupplyDisplay = PriceVsSupplyDisplay;
const RateVsTimeDisplay = ({ curveConfig, reserves, supply, setTimeOffset, maxTime, timeOffset, setMaxTime, }) => {
    const data = (0, react_1.useMemo)(() => {
        const step = Number(maxTime) / NUM_DATAPOINTS;
        const ret = [];
        for (let i = 0; i < Number(maxTime); i += step) {
            const currPricing = (0, spl_token_bonding_1.fromCurve)(curveConfig, Number(reserves), Number(supply), 0);
            const incAmt = 1;
            const plusOnePricing = (0, spl_token_bonding_1.fromCurve)(curveConfig, Number(reserves) + currPricing.buyTargetAmount(incAmt, 0, 0, Number(i)), Number(supply + incAmt), 0);
            const priceIncrease = plusOnePricing.buyTargetAmount(incAmt, 0, 0, Number(i)) -
                currPricing.buyTargetAmount(incAmt, 0, 0, Number(i));
            const priceFall = currPricing.buyTargetAmount(incAmt, 0, 0, Number(i)) -
                currPricing.buyTargetAmount(incAmt, 0, 0, Number(i + 1));
            ret.push({
                rate: priceFall / priceIncrease,
                timeOffset: i,
            });
        }
        return ret;
    }, [curveConfig, reserves, supply, maxTime]);
    return (react_1.default.createElement(react_3.VStack, { justify: "stretch" },
        react_1.default.createElement(react_3.Box, { w: "full", h: "500px" },
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
                react_1.default.createElement(recharts_1.LineChart, { width: 500, height: 300, data: data, margin: {
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    } },
                    react_1.default.createElement(recharts_1.ReferenceLine, { x: Number(timeOffset), stroke: "orange" }),
                    react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }),
                    react_1.default.createElement(recharts_1.XAxis, { tickCount: 10, type: "number", tickFormatter: (seconds) => Math.floor(formatTime(seconds, Number(maxTime))).toString(), dataKey: "timeOffset", label: { value: `Time (${getUnit(Number(maxTime))})`, dy: 10 }, domain: [0, Number(maxTime)] }),
                    react_1.default.createElement(recharts_1.YAxis, { type: "number", label: {
                            value: "Breakeven Sell Rate (units/sec)",
                            position: "insideLeft",
                            angle: -90,
                            dy: 0,
                        } }),
                    react_1.default.createElement(recharts_1.Tooltip, null),
                    react_1.default.createElement(recharts_1.Legend, null),
                    react_1.default.createElement(recharts_1.Line, { activeDot: {
                            onClick: (e, payload) => {
                                //@ts-ignore
                                setTimeOffset(payload.payload.timeOffset);
                            },
                        }, type: "monotone", dataKey: "rate", stroke: "#8884d8" }))))));
};
exports.RateVsTimeDisplay = RateVsTimeDisplay;
const EstimatedSalesVsTime = ({ curveConfig, reserves, supply, setTimeOffset, maxTime, timeOffset, setMaxTime, endSupply, }) => {
    const data = (0, react_1.useMemo)(() => {
        const step = Number(maxTime) / NUM_DATAPOINTS;
        const ret = [];
        for (let i = 0; i < Number(maxTime); i += step) {
            const currPricing = (0, spl_token_bonding_1.fromCurve)(curveConfig, Number(reserves), Number(supply), 0);
            const incAmt = 1;
            const plusOnePricing = (0, spl_token_bonding_1.fromCurve)(curveConfig, Number(reserves) + currPricing.buyTargetAmount(incAmt, 0, 0, Number(i)), Number(supply + incAmt), 0);
            const priceIncrease = plusOnePricing.buyTargetAmount(incAmt, 0, 0, Number(i)) -
                currPricing.buyTargetAmount(incAmt, 0, 0, Number(i));
            const priceFall = currPricing.buyTargetAmount(incAmt, 0, 0, Number(i)) -
                currPricing.buyTargetAmount(incAmt, 0, 0, Number(i + 1));
            const prev = ret[ret.length - 1] ? ret[ret.length - 1].total : 0;
            let total = (priceFall / priceIncrease) * step + prev;
            ret.push({
                total: total > Number(endSupply) ? 0 : total,
                timeOffset: i,
            });
        }
        return ret;
    }, [curveConfig, reserves, supply, maxTime]);
    return (react_1.default.createElement(react_3.VStack, { justify: "stretch" },
        react_1.default.createElement(react_3.Box, { w: "full", h: "500px" },
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
                react_1.default.createElement(recharts_1.LineChart, { width: 500, height: 300, data: data, margin: {
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    } },
                    react_1.default.createElement(recharts_1.ReferenceLine, { x: Number(timeOffset), stroke: "orange" }),
                    react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }),
                    react_1.default.createElement(recharts_1.XAxis, { tickCount: 10, type: "number", tickFormatter: (seconds) => Math.floor(formatTime(seconds, Number(maxTime))).toString(), dataKey: "timeOffset", label: { value: `Time (${getUnit(Number(maxTime))})`, dy: 10 }, domain: [0, Number(maxTime)] }),
                    react_1.default.createElement(recharts_1.YAxis, { type: "number", label: {
                            value: "Estimated Total Sales",
                            position: "insideLeft",
                            angle: -90,
                            dy: 0,
                        } }),
                    react_1.default.createElement(recharts_1.Tooltip, null),
                    react_1.default.createElement(recharts_1.Legend, null),
                    react_1.default.createElement(recharts_1.Line, { activeDot: {
                            onClick: (e, payload) => {
                                //@ts-ignore
                                setTimeOffset(payload.payload.timeOffset);
                            },
                        }, type: "monotone", dataKey: "total", stroke: "#8884d8" }))))));
};
exports.EstimatedSalesVsTime = EstimatedSalesVsTime;
const PriceVsTimeDisplay = ({ curveConfig, reserves, supply, setTimeOffset, maxTime, timeOffset, setMaxTime, }) => {
    const data = (0, react_1.useMemo)(() => {
        const step = Number(maxTime) / NUM_DATAPOINTS;
        const ret = [];
        for (let i = 0; i < Number(maxTime); i += step) {
            const currPricing = (0, spl_token_bonding_1.fromCurve)(curveConfig, Number(reserves), Number(supply), 0);
            const price = currPricing.buyTargetAmount(1, 0, 0, Number(i));
            ret.push({
                price,
                timeOffset: i,
            });
        }
        return ret;
    }, [curveConfig, reserves, supply, maxTime]);
    return (react_1.default.createElement(react_3.VStack, { justify: "stretch" },
        react_1.default.createElement(react_3.Box, { w: "full", h: "500px" },
            react_1.default.createElement(recharts_1.ResponsiveContainer, { width: "100%", height: "100%" },
                react_1.default.createElement(recharts_1.LineChart, { width: 500, height: 300, data: data, margin: {
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    } },
                    react_1.default.createElement(recharts_1.ReferenceLine, { x: Number(timeOffset), stroke: "orange" }),
                    react_1.default.createElement(recharts_1.CartesianGrid, { strokeDasharray: "3 3" }),
                    react_1.default.createElement(recharts_1.XAxis, { tickCount: 10, type: "number", tickFormatter: (seconds) => Math.floor(formatTime(seconds, Number(maxTime))).toString(), dataKey: "timeOffset", label: { value: `Time (${getUnit(Number(maxTime))})`, dy: 10 }, domain: [0, Number(maxTime)] }),
                    react_1.default.createElement(recharts_1.YAxis, { type: "number", label: {
                            value: "Price",
                            position: "insideLeft",
                            angle: -90,
                            dy: 0,
                        } }),
                    react_1.default.createElement(recharts_1.Tooltip, null),
                    react_1.default.createElement(recharts_1.Legend, null),
                    react_1.default.createElement(recharts_1.Line, { activeDot: {
                            onClick: (e, payload) => {
                                //@ts-ignore
                                setTimeOffset(payload.payload.timeOffset);
                            },
                        }, type: "monotone", dataKey: "price", stroke: "#8884d8" }))))));
};
exports.PriceVsTimeDisplay = PriceVsTimeDisplay;
function getUnit(maxTime) {
    if (maxTime < 60) {
        return "seconds";
    }
    else if (maxTime < 60 * 60) {
        return "minutes";
    }
    else if (maxTime < 60 * 60 * 72) {
        return "hours";
    }
    else {
        return "days";
    }
}
/**
 * Seconds from 0 to 60
 * Minutes from 0 to 60 minutes
 * Hours from 0 to 72 hours
 * Days onward
 */
function formatTime(time, maxTime) {
    const unit = getUnit(maxTime);
    if (unit === "seconds") {
        return time;
    }
    else if (unit === "minutes") {
        return time / 60;
    }
    else if (unit === "hours") {
        return time / (60 * 60);
    }
    else {
        return time / (60 * 60 * 24);
    }
}
const CurveConfiguratorFromVariables = ({ priceVsSupply = true, priceVsTime = true, rateVsTime = false, salesVsTime = false }) => {
    const { curveConfig, startSupply: passedStartSupply, endSupply: passedEndSupply, reserves: passedReserves, supply: passedSupply, maxTime: passedMaxTime, supplyOffset, } = (0, variables_1.useVariables)();
    const [timeOffset, setTimeOffset] = (0, react_2.useQueryString)("timeOffset", "0");
    const [reserves, setReserves] = (0, react_2.useQueryString)("reserves", "0");
    const [supply, setSupply] = (0, react_2.useQueryString)("supply", "0");
    const [startSupply, setStartSupply] = (0, react_2.useQueryString)("startSupply", passedStartSupply || "0");
    const [endSupply, setEndSupply] = (0, react_2.useQueryString)("endSupply", passedEndSupply || "100");
    const [maxTime, setMaxTime] = (0, react_2.useQueryString)("maxTime", passedMaxTime || "10");
    const args = {
        timeOffset,
        setTimeOffset,
        reserves,
        setReserves,
        supply,
        setSupply,
        startSupply,
        setStartSupply,
        endSupply,
        setEndSupply,
        maxTime,
        setMaxTime,
    };
    const numCharts = +priceVsSupply + +priceVsTime + +rateVsTime;
    (0, react_1.useEffect)(() => {
        passedReserves && setReserves(passedReserves);
    }, [passedReserves]);
    (0, react_1.useEffect)(() => {
        passedSupply && setSupply(passedSupply);
    }, [passedSupply]);
    (0, react_1.useEffect)(() => {
        passedEndSupply && setEndSupply(passedEndSupply);
    }, [passedEndSupply]);
    (0, react_1.useEffect)(() => {
        passedStartSupply && setStartSupply(passedStartSupply);
    }, [passedStartSupply]);
    (0, react_1.useEffect)(() => {
        passedMaxTime && setMaxTime(passedMaxTime);
    }, [passedMaxTime]);
    const rawCurve = curveConfig === null || curveConfig === void 0 ? void 0 : curveConfig.toRawConfig();
    if (!curveConfig) {
        return react_1.default.createElement(react_3.Box, { padding: 4, mb: 4, rounded: "lg", backgroundColor: "gray.200" }, "Run the above code block to show curve");
    }
    return (react_1.default.createElement(react_3.VStack, { w: "full" },
        react_1.default.createElement(react_3.SimpleGrid, { columns: 3, w: "full" },
            react_1.default.createElement(react_3.VStack, null,
                react_1.default.createElement("label", null, "Reserves"),
                react_1.default.createElement(react_3.Input, { type: "number", step: 0.001, onChange: (e) => setReserves(e.target.value), value: reserves })),
            react_1.default.createElement(react_3.VStack, null,
                react_1.default.createElement("label", null, "Supply"),
                react_1.default.createElement(react_3.Input, { type: "number", step: 0.001, onChange: (e) => setSupply(e.target.value), value: supply })),
            react_1.default.createElement(react_3.VStack, null,
                react_1.default.createElement("label", null, "Seconds since Launch"),
                react_1.default.createElement(react_3.Input, { type: "number", step: 1, onChange: (e) => setTimeOffset(e.target.value), value: timeOffset })),
            react_1.default.createElement(react_3.VStack, null,
                react_1.default.createElement("label", null, "Start Supply"),
                react_1.default.createElement(react_3.Input, { type: "number", step: 0.001, onChange: (e) => setStartSupply(e.target.value), value: startSupply })),
            react_1.default.createElement(react_3.VStack, null,
                react_1.default.createElement("label", null, "End Supply"),
                react_1.default.createElement(react_3.Input, { type: "number", step: 0.001, onChange: (e) => setEndSupply(e.target.value), value: endSupply })),
            react_1.default.createElement(react_3.VStack, null,
                react_1.default.createElement("label", null, "Max Time"),
                react_1.default.createElement(react_3.Input, { type: "number", step: 1, onChange: (e) => setMaxTime(e.target.value), value: maxTime }))),
        react_1.default.createElement(react_3.SimpleGrid, { columns: [1, 1, 1, Math.min(numCharts, 2)], w: "full" },
            priceVsSupply && (react_1.default.createElement(exports.PriceVsSupplyDisplay, Object.assign({ supplyOffset: supplyOffset || 0, curveConfig: rawCurve }, args))),
            priceVsTime && react_1.default.createElement(exports.PriceVsTimeDisplay, Object.assign({ curveConfig: rawCurve }, args)),
            rateVsTime && react_1.default.createElement(exports.RateVsTimeDisplay, Object.assign({ curveConfig: rawCurve }, args)),
            salesVsTime && (react_1.default.createElement(exports.EstimatedSalesVsTime, Object.assign({ curveConfig: rawCurve }, args))))));
};
exports.CurveConfiguratorFromVariables = CurveConfiguratorFromVariables;
//# sourceMappingURL=index.js.map