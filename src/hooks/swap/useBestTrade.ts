import { useMemo } from "react";
import { Fraction, Pool, Route, TradeType } from "src/sdk/src";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { JettonAmount } from "src/sdk/src/entities/JettonAmount";
import { Trade } from "src/sdk/src/entities/trade";
import { TradeState, TradeStateType } from "src/types/trade-state";

// TODO: Remove this
import BigNumber from "bignumber.js";

// const DEFAULT_GAS_QUOTE = 2_000_000

/**
 * Returns the best v3 trade for a desired exact input swap
 * @param amountIn the amount to swap in
 * @param currencyOut the desired output currency
 */
export function useBestTradeExactIn(
    amountIn?: JettonAmount<Jetton>,
    currencyOut?: Jetton,
    pool?: Pool | null
): {
    state: TradeStateType;
    trade: Trade<Jetton, Jetton, TradeType.EXACT_INPUT> | null;
    fee?: bigint[] | null;
    priceAfterSwap?: bigint[] | null;
} {
    // const { routes, loading: routesLoading } = useAllRoutes(amountIn?.jetton, currencyOut);

    const trade = useMemo(() => {
        if (!amountIn || !currencyOut || !pool) {
            return {
                state: TradeState.INVALID,
                trade: null,
                refetch: undefined,
            };
        }

        const route = new Route([pool], amountIn.jetton, currencyOut);

        const x = BigNumber(amountIn.toFixed());
        const L = BigNumber(pool.liquidity.toString());
        const sp = BigNumber(pool.sqrtRatioX96.toString()).div(BigNumber(2).pow(96));
        const num: BigNumber = L.pow(BigNumber(2));
        const denum: BigNumber = L.div(sp).plus(BigNumber((-x).toString()));
        const y: BigNumber = num.div(denum).plus(L.times(sp));

        const outputAmount = BigInt(y.toFixed(0));

        console.log("outputAmount", outputAmount);

        return {
            state: TradeState.VALID,
            fee: [100n],
            trade: Trade.createUncheckedTrade({
                route,
                tradeType: TradeType.EXACT_INPUT,
                inputAmount: amountIn,
                outputAmount: JettonAmount.fromRawAmount(currencyOut, outputAmount.toString()),
            }),
            priceAfterSwap: null,
            refetch: undefined,
        };
    }, [amountIn, currencyOut, pool]);

    return trade;
}

/**
 * Returns the best v3 trade for a desired exact output swap
 * @param currencyIn the desired input currency
 * @param amountOut the amount to swap out
 */
export function useBestTradeExactOut(
    currencyIn?: Jetton,
    amountOut?: JettonAmount<Jetton>,
    pool?: Pool | null
): {
    state: TradeStateType;
    trade: Trade<Jetton, Jetton, TradeType.EXACT_OUTPUT> | null;
    fee?: bigint[] | null;
    priceAfterSwap?: bigint[] | null;
} {
    // const { routes, loading: routesLoading } = useAllRoutes(currencyIn, amountOut?.jetton);

    const trade = useMemo(() => {
        if (!amountOut || !currencyIn || !pool) {
            return {
                state: TradeState.INVALID,
                trade: null,
                refetch: undefined,
            };
        }

        const route = new Route([pool], currencyIn, amountOut.jetton);

        return {
            state: TradeState.VALID,
            fee: [100n],
            trade: Trade.createUncheckedTrade({
                route,
                tradeType: TradeType.EXACT_OUTPUT,
                inputAmount: JettonAmount.fromRawAmount(currencyIn, amountOut.quotient).multiply(new Fraction(1000, 987)), // hardcode price
                outputAmount: amountOut,
            }),
            priceAfterSwap: null,
            refetch: undefined,
        };
    }, [amountOut, currencyIn, pool]);

    return trade;
}
