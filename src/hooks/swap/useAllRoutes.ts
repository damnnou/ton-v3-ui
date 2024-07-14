import { useMemo } from "react";
import { DEFAULT_TICK_SPACING } from "src/sdk/src";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { Pool } from "src/sdk/src/entities/Pool";
import { Route } from "src/sdk/src/entities/route";
import { useSwapPools } from "./useSwapPools";

/**
 * Returns true if poolA is equivalent to poolB
 * @param poolA one of the two pools
 * @param poolB the other pool
 */
function poolEquals(poolA: Pool, poolB: Pool): boolean {
    return poolA === poolB || (poolA.jetton0.equals(poolB.jetton0) && poolA.jetton1.equals(poolB.jetton1));
}

function computeAllRoutes(
    currencyIn: Jetton,
    currencyOut: Jetton,
    pools: { tokens: [Jetton, Jetton]; pool: { address: string; liquidity: string; price: string; tick: string; fee: string } }[],
    currentPath: Pool[] = [],
    allPaths: Route<Jetton, Jetton>[] = [],
    startCurrencyIn: Jetton = currencyIn,
    maxHops = 2
): Route<Jetton, Jetton>[] {
    const tokenIn = currencyIn;
    const tokenOut = currencyOut;

    if (!tokenIn || !tokenOut) throw new Error("Missing tokenIn/tokenOut");

    for (const pool of pools) {
        const [tokenA, tokenB] = pool.tokens;

        const { liquidity, price, tick, fee } = pool.pool;

        const newPool = new Pool(tokenA, tokenB, +fee as unknown as 100, price, liquidity, Number(tick), DEFAULT_TICK_SPACING);

        if (!newPool.involvesToken(tokenIn) || currentPath.find((pathPool) => poolEquals(newPool, pathPool))) continue;

        const outputToken = newPool.jetton0.equals(tokenIn) ? newPool.jetton1 : newPool.jetton0;
        if (outputToken.equals(tokenOut)) {
            allPaths.push(new Route([...currentPath, newPool], startCurrencyIn, currencyOut));
        } else if (maxHops > 1) {
            computeAllRoutes(outputToken, currencyOut, pools, [...currentPath, newPool], allPaths, startCurrencyIn, maxHops - 1);
        }
    }

    return allPaths;
}

/**
 * Returns all the routes from an input currency to an output currency
 * @param currencyIn the input currency
 * @param currencyOut the output currency
 */
export function useAllRoutes(currencyIn?: Jetton, currencyOut?: Jetton): { loading: boolean; routes: Route<Jetton, Jetton>[] } {
    const { pools, loading: poolsLoading } = useSwapPools(currencyIn, currencyOut);
    // const { isMultihop } = useUserState();

    const isMultihop = false;

    return useMemo(() => {
        if (poolsLoading || !pools || !currencyIn || !currencyOut)
            return {
                loading: true,
                routes: [],
            };

        // Hack
        // const singleIfWrapped = (currencyIn.isNative || currencyOut.isNative)

        const routes = computeAllRoutes(currencyIn, currencyOut, pools, [], [], currencyIn, isMultihop ? 3 : 1);

        return { loading: false, routes };
    }, [currencyIn, currencyOut, pools, poolsLoading, isMultihop]);
}
