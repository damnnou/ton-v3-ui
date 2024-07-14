import { useMemo } from "react";
import { Fraction, TradeType } from "src/sdk/src";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { JettonAmount } from "src/sdk/src/entities/JettonAmount";
import { Trade } from "src/sdk/src/entities/trade";
import { TradeState, TradeStateType } from "src/types/trade-state";
import { useAllRoutes } from "./useAllRoutes";

// const DEFAULT_GAS_QUOTE = 2_000_000

/**
 * Returns the best v3 trade for a desired exact input swap
 * @param amountIn the amount to swap in
 * @param currencyOut the desired output currency
 */
export function useBestTradeExactIn(
    amountIn?: JettonAmount<Jetton>,
    currencyOut?: Jetton
): {
    state: TradeStateType;
    trade: Trade<Jetton, Jetton, TradeType.EXACT_INPUT> | null;
    fee?: bigint[] | null;
    priceAfterSwap?: bigint[] | null;
} {
    const { routes, loading: routesLoading } = useAllRoutes(amountIn?.jetton, currencyOut);
    // const {
    //     data: quotesResults,
    //     isLoading: isQuotesLoading,
    //     refetch,
    // } = useQuotesResults({
    //     exactInput: true,
    //     amountIn,
    //     currencyOut,
    // });

    const trade = useMemo(() => {
        if (!amountIn || !currencyOut) {
            return {
                state: TradeState.INVALID,
                trade: null,
                refetch: undefined,
            };
        }

        if (routesLoading) {
            return {
                state: TradeState.LOADING,
                trade: null,
            };
        }

        // const { bestRoute, amountOut, fee, priceAfterSwap } = [].reduce(
        //     (
        //         currentBest: {
        //             bestRoute: Route<Jetton, Jetton> | null;
        //             amountOut: any | null;
        //             fee: bigint[] | null;
        //             priceAfterSwap: bigint[] | null;
        //         },
        //         { result }: any,
        //         i
        //     ) => {
        //         if (!result) return currentBest;

        //         if (currentBest.amountOut === null) {
        //             return {
        //                 bestRoute: routes[i],
        //                 amountOut: result[0],
        //                 fee: result[5],
        //                 priceAfterSwap: result[2],
        //             };
        //         } else if (currentBest.amountOut < result[0]) {
        //             return {
        //                 bestRoute: routes[i],
        //                 amountOut: result[0],
        //                 fee: result[5],
        //                 priceAfterSwap: result[2],
        //             };
        //         }

        //         return currentBest;
        //     },
        //     {
        //         bestRoute: null,
        //         amountOut: null,
        //         fee: null,
        //         priceAfterSwap: null,
        //     }
        // );

        // if (!amountOut) {
        //     return {
        //         state: TradeState.NO_ROUTE_FOUND,
        //         trade: null,
        //         fee: null,
        //         priceAfterSwap: null,
        //     };
        // }

        return {
            state: TradeState.VALID,
            fee: [100n],
            trade: Trade.createUncheckedTrade({
                route: routes[0],
                tradeType: TradeType.EXACT_INPUT,
                inputAmount: amountIn,
                outputAmount: JettonAmount.fromRawAmount(currencyOut, amountIn.quotient).multiply(new Fraction(987, 1000)), // hardcode price
            }),
            priceAfterSwap: null,
            refetch: undefined,
        };
    }, [amountIn, currencyOut, routes, routesLoading]);

    return trade;
}

/**
 * Returns the best v3 trade for a desired exact output swap
 * @param currencyIn the desired input currency
 * @param amountOut the amount to swap out
 */
export function useBestTradeExactOut(
    currencyIn?: Jetton,
    amountOut?: JettonAmount<Jetton>
): {
    state: TradeStateType;
    trade: Trade<Jetton, Jetton, TradeType.EXACT_OUTPUT> | null;
    fee?: bigint[] | null;
    priceAfterSwap?: bigint[] | null;
} {
    const { routes, loading: routesLoading } = useAllRoutes(currencyIn, amountOut?.jetton);

    const trade = useMemo(() => {
        if (!amountOut || !currencyIn) {
            return {
                state: TradeState.INVALID,
                trade: null,
                refetch: undefined,
            };
        }

        if (routesLoading) {
            return {
                state: TradeState.LOADING,
                trade: null,
            };
        }

        // const { bestRoute, amountIn, fee, priceAfterSwap } = [].reduce(
        //     (
        //         currentBest: {
        //             bestRoute: Route<Jetton, Jetton> | null;
        //             amountIn: any | null;
        //             fee: bigint[] | null;
        //             priceAfterSwap: bigint[] | null;
        //         },
        //         { result }: any,
        //         i
        //     ) => {
        //         if (!result) return currentBest;

        //         if (currentBest.amountIn === null) {
        //             return {
        //                 bestRoute: routes[i],
        //                 amountIn: result[1],
        //                 fee: result[5],
        //                 priceAfterSwap: result[2],
        //             };
        //         } else if (currentBest.amountIn > result[0]) {
        //             return {
        //                 bestRoute: routes[i],
        //                 amountIn: result[1],
        //                 fee: result[5],
        //                 priceAfterSwap: result[2],
        //             };
        //         }

        //         return currentBest;
        //     },
        //     {
        //         bestRoute: null,
        //         amountIn: null,
        //         fee: null,
        //         priceAfterSwap: null,
        //     }
        // );

        // if (!bestRoute || !amountIn) {
        //     return {
        //         state: TradeState.NO_ROUTE_FOUND,
        //         trade: null,
        //         fee: null,
        //         priceAfterSwap,
        //     };
        // }

        return {
            state: TradeState.VALID,
            fee: [100n],
            trade: Trade.createUncheckedTrade({
                route: routes[0],
                tradeType: TradeType.EXACT_OUTPUT,
                inputAmount: JettonAmount.fromRawAmount(currencyIn, amountOut.quotient).multiply(new Fraction(1000, 987)), // hardcode price
                outputAmount: amountOut,
            }),
            priceAfterSwap: null,
            refetch: undefined,
        };
    }, [amountOut, currencyIn, routes, routesLoading]);

    return trade;
}
