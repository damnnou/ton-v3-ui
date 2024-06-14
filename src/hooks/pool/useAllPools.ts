import { useTonConnect } from "../common/useTonConnect";
import { Jetton } from "src/constants/jettons";
import { useTonClient } from "../common/useTonClient";
import { useEffect, useState } from "react";
import { Pool } from "./usePool";
import { Router } from "src/contracts/Router";
import { ROUTER } from "src/constants/addresses";
import { CHAIN } from "@tonconnect/ui-react";
import { useTokensState } from "src/state/tokensStore";

export function useAllPools() {
    const [isLoading, setIsLoading] = useState(false);
    const [poolList, setPoolList] = useState<Pool[]>([]);
    const [isFirstTime, setIsFirstTime] = useState(false);

    const { network } = useTonConnect();
    const tonApiClient = useTonClient();

    const { importedTokens } = useTokensState();

    useEffect(() => {
        if (!tonApiClient || isFirstTime) return;
        setIsFirstTime(true);

        const router = new Router({ tonApiClient: tonApiClient.provider, address: ROUTER[network || CHAIN.MAINNET] });

        const tokenKeys = Object.values(importedTokens[network || CHAIN.MAINNET]);

        function getAllCombinations(arr: Jetton[]) {
            const result = [];
            for (let i = 0; i < arr.length; i++) {
                for (let j = i + 1; j < arr.length; j++) {
                    result.push([arr[i], arr[j]]);
                }
            }
            return result;
        }

        const allPools = getAllCombinations(tokenKeys);

        const findAllPools = async () => {
            setIsLoading(true);
            const pools: Pool[] = [];

            for (const tokens of allPools) {
                const token0 = tokens[0];
                const token1 = tokens[1];

                try {
                    console.log("Fetching pool: ", token0.symbol, " - ", token1.symbol);
                    const pool = await router.getPool({ token0: token0.address, token1: token1.address });
                    if (!pool) throw new Error();

                    const poolData = await pool.getData();
                    pools.push({ ...poolData, token0: token0, token1: token1, address: pool.address });
                } catch (e) {
                    continue;
                }
            }

            setPoolList(pools);

            setIsLoading(false);
        };

        findAllPools();
    }, [network, tonApiClient, isFirstTime, importedTokens]);

    return { isLoading, data: poolList };
}
