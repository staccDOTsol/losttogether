import { CurveV0 } from "@strata-foundation/spl-token-bonding";
export declare const PriceVsSupplyDisplay: ({ curveConfig, timeOffset, setTimeOffset, reserves, setReserves, startSupply, setStartSupply, endSupply, setEndSupply, setSupply, supply, supplyOffset, }: {
    curveConfig: CurveV0;
    timeOffset: string;
    setTimeOffset(args: string): void;
    reserves: string;
    setReserves(args: string): void;
    supply: string;
    setSupply(args: string): void;
    startSupply: string;
    setStartSupply(args: string): void;
    endSupply: string;
    setEndSupply(args: string): void;
    supplyOffset: number;
}) => JSX.Element;
export declare const RateVsTimeDisplay: ({ curveConfig, reserves, supply, setTimeOffset, maxTime, timeOffset, setMaxTime, }: {
    curveConfig: CurveV0;
    maxTime: string;
    timeOffset: string;
    setMaxTime(args: string): void;
    setTimeOffset(args: string): void;
    reserves: string;
    supply: string;
}) => JSX.Element;
export declare const EstimatedSalesVsTime: ({ curveConfig, reserves, supply, setTimeOffset, maxTime, timeOffset, setMaxTime, endSupply, }: {
    curveConfig: CurveV0;
    maxTime: string;
    timeOffset: string;
    setMaxTime(args: string): void;
    setTimeOffset(args: string): void;
    reserves: string;
    supply: string;
    endSupply: string;
}) => JSX.Element;
export declare const PriceVsTimeDisplay: ({ curveConfig, reserves, supply, setTimeOffset, maxTime, timeOffset, setMaxTime, }: {
    curveConfig: CurveV0;
    maxTime: string;
    timeOffset: string;
    setMaxTime(args: string): void;
    setTimeOffset(args: string): void;
    reserves: string;
    supply: string;
}) => JSX.Element;
export declare type CurveConfiguratorFromVariablesProps = {
    priceVsSupply: boolean;
    priceVsTime: boolean;
    rateVsTime: boolean;
    salesVsTime: boolean;
};
export declare const CurveConfiguratorFromVariables: ({ priceVsSupply, priceVsTime, rateVsTime, salesVsTime }: CurveConfiguratorFromVariablesProps) => JSX.Element;
//# sourceMappingURL=index.d.ts.map