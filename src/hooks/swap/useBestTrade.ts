import { useEffect, useMemo, useState } from "react";
import { Pool, Route, SqrtPriceMath, TradeType } from "src/sdk/src";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { JettonAmount } from "src/sdk/src/entities/JettonAmount";
import { Trade } from "src/sdk/src/entities/trade";
import { TradeState, TradeStateType } from "src/types/trade-state";
import { usePoolV3Contract } from "../contracts/usePoolV3Contract";
import { POOL } from "src/constants/addresses";

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

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [amountOut, setAmountOut] = useState<bigint>();

    const poolV3Contract = usePoolV3Contract(POOL);

    useEffect(() => {
        if (!amountIn || !currencyOut || !poolV3Contract || !pool) return;
        setIsError(false);
        setIsLoading(true);
        const nextSqrtPrice = SqrtPriceMath.getNextSqrtPriceFromInput(pool.sqrtRatioX96, pool.liquidity, amountIn.quotient, true);

        poolV3Contract
            .getSwapEstimate(true, BigInt(amountIn.quotient.toString()), BigInt(nextSqrtPrice.toString()))
            .then((res) => {
                setAmountOut(-res.amount1);
                setIsLoading(false);
            })
            .catch(() => {
                setIsError(true);
            });
    }, [amountIn, currencyOut, pool, poolV3Contract]);

    const trade = useMemo(() => {
        if (!amountIn || !currencyOut || !pool || (!amountOut && !isLoading) || isError) {
            return {
                state: TradeState.INVALID,
                trade: null,
                refetch: undefined,
            };
        }

        if (isLoading || !amountOut) {
            return {
                state: TradeState.LOADING,
                trade: null,
                refetch: undefined,
            };
        }

        const route = new Route([pool], amountIn.jetton, currencyOut);

        return {
            state: TradeState.VALID,
            fee: [100n],
            trade: Trade.createUncheckedTrade({
                route,
                tradeType: TradeType.EXACT_INPUT,
                inputAmount: amountIn,
                outputAmount: JettonAmount.fromRawAmount(currencyOut, amountOut.toString()),
            }),
            priceAfterSwap: null,
            refetch: undefined,
        };
    }, [amountIn, currencyOut, pool, amountOut, isLoading, isError]);

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
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [amountIn, setAmountIn] = useState<bigint>();

    const poolV3Contract = usePoolV3Contract(POOL);

    useEffect(() => {
        if (!amountOut || !currencyIn || !poolV3Contract || !pool) return;
        setIsError(false);
        setIsLoading(true);
        const nextSqrtPrice = SqrtPriceMath.getNextSqrtPriceFromInput(pool.sqrtRatioX96, pool.liquidity, amountOut.quotient, true);

        poolV3Contract
            .getSwapEstimate(true, BigInt(amountOut.quotient.toString()), BigInt(nextSqrtPrice.toString()))
            .then((res) => {
                /* dirt */
                const amount0 = Number(res.amount0);
                const amount1 = Number(-res.amount1);
                const multiplier = amount0 / amount1;

                setAmountIn(BigInt(Math.floor(amount0 * multiplier)));
                setIsLoading(false);
            })
            .catch(() => {
                setIsError(true);
            });
    }, [amountOut, currencyIn, pool, poolV3Contract]);

    const trade = useMemo(() => {
        if (!amountOut || !currencyIn || !pool || (!amountIn && !isLoading) || isError) {
            return {
                state: TradeState.INVALID,
                trade: null,
                refetch: undefined,
            };
        }

        if (isLoading || !amountIn) {
            return {
                state: TradeState.LOADING,
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
                inputAmount: JettonAmount.fromRawAmount(currencyIn, amountIn.toString()),
                outputAmount: amountOut,
            }),
            priceAfterSwap: null,
            refetch: undefined,
        };
    }, [amountOut, currencyIn, pool, amountIn, isLoading, isError]);

    return trade;
}
