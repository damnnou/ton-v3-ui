import { useEffect, useMemo, useState } from "react";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { useAllCurrencyCombinations } from "./useAllCurrencyCombinations";
import { Pool } from "src/sdk/src/entities/Pool";
import { usePoolV3 } from "../pool/usePoolV3";
import { POOL } from "src/constants/addresses";

/**
 * Returns all the existing pools that should be considered for swapping between an input currency and an output currency
 * @param currencyIn the input currency
 * @param currencyOut the output currency
 */
export function useSwapPools(
    currencyIn?: Jetton,
    currencyOut?: Jetton
): {
    pools: {
        tokens: [Jetton, Jetton];
        pool: {
            address: string;
            liquidity: string;
            price: string;
            tick: string;
            fee: string;
            // token0: TokenFieldsFragment;
            // token1: TokenFieldsFragment;
        };
    }[];
    loading: boolean;
} {
    const [, nPool] = usePoolV3(POOL);

    useEffect(() => {
        if (nPool) setExistingPools([nPool]);
    }, [nPool]);

    const [existingPools, setExistingPools] = useState<Pool[]>();

    const allCurrencyCombinations = useAllCurrencyCombinations(currencyIn, currencyOut);

    // const [getMultiplePools] = useMultiplePoolsLazyQuery()

    useEffect(() => {
        async function getPools() {
            // const poolsAddresses = allCurrencyCombinations.map(([tokenA, tokenB]) => computePoolAddress({
            //     tokenA,
            //     tokenB
            // }) as Address)
            // const poolsData = await getMultiplePools({
            //     variables: {
            //         poolIds: poolsAddresses.map(address => address.toLowerCase())
            //     }
            // })
            // const poolsLiquidities = await Promise.allSettled(poolsAddresses.map(address => getAlgebraPool({
            //     address
            // }).read.liquidity()))
            // const poolsGlobalStates = await Promise.allSettled(poolsAddresses.map(address => getAlgebraPool({
            //     address
            // }).read.globalState()))
            // const pools = poolsData.data && poolsData.data.pools.map(pool => ({ address: pool.id, liquidity: pool.liquidity, price: pool.sqrtPrice, tick: pool.tick, fee: pool.fee, token0: pool.token0, token1: pool.token1 }))
            // setExistingPools();
        }

        Boolean(allCurrencyCombinations.length) && getPools();
    }, [allCurrencyCombinations]);

    return useMemo(() => {
        if (!existingPools)
            return {
                pools: [],
                loading: true,
            };

        return {
            pools: existingPools
                .map((pool) => ({
                    tokens: [
                        new Jetton(pool.jetton0.address, pool.jetton0.decimals, pool.jetton0.symbol, pool.jetton0.name),
                        new Jetton(pool.jetton1.address, pool.jetton1.decimals, pool.jetton1.symbol, pool.jetton1.name),
                    ] as [Jetton, Jetton],
                    pool: {
                        address: POOL,
                        liquidity: pool.liquidity.toString(),
                        price: pool.sqrtRatioX96.toString(),
                        tick: pool.tickCurrent.toString(),
                        fee: pool.fee.toString(),
                    },
                }))
                .filter(({ pool }) => {
                    return pool;
                }),
            loading: false,
        };
    }, [existingPools]);
}
