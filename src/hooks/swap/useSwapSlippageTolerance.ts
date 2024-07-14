import { useMemo } from "react";
import { TradeType } from "src/sdk/src";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { Percent } from "src/sdk/src/entities/Percent";
import { Trade } from "src/sdk/src/entities/trade";
import { useUserSlippageToleranceWithDefault } from "src/state/userStore";

const SWAP_DEFAULT_SLIPPAGE = new Percent(50, 10_000); // .50%
const ONE_TENTHS_PERCENT = new Percent(10, 10_000); // .10%

export default function useSwapSlippageTolerance(trade: Trade<Jetton, Jetton, TradeType> | undefined): Percent {
    const defaultSlippageTolerance = useMemo(() => {
        if (!trade) return ONE_TENTHS_PERCENT;
        return SWAP_DEFAULT_SLIPPAGE;
    }, [trade]);

    return useUserSlippageToleranceWithDefault(defaultSlippageTolerance);
}
