import { usePoolV3Contract } from "../contracts/usePoolV3Contract";
import { OpenedContract } from "@ton/core";
import { PoolV3Contract } from "src/sdk/src/contracts/PoolV3Contract";
import useSWR from "swr";
import { PoolState, PoolStateType } from "src/types/pool-state";
import { useMemo, useState } from "react";
import { useJettonByJettonWallet } from "../jetton/useJetton";
import { Pool } from "src/sdk/src";

const fetchPoolData = (poolContract: OpenedContract<PoolV3Contract> | undefined) => {
    return poolContract?.getPoolStateAndConfiguration();
};

export function usePoolV3(poolAddress: string | undefined): [PoolStateType, Pool | null] {
    const poolContract = usePoolV3Contract(poolAddress);
    const [jettonWallets, setJettonWallets] = useState<string[]>();

    const jetton0 = useJettonByJettonWallet(jettonWallets?.[0]);
    const jetton1 = useJettonByJettonWallet(jettonWallets?.[1]);

    const {
        data: poolData,
        error: isPoolError,
        isLoading: isPoolLoading,
    } = useSWR(["poolData", poolAddress, poolContract], () => fetchPoolData(poolContract), {
        revalidateOnFocus: false,
        revalidateOnMount: false,
        onSuccess(data) {
            if (data) setJettonWallets([data.jetton0_wallet.toString(), data.jetton1_wallet.toString()]);
        },
    });

    const isJettonsLoading = !jetton0 || !jetton1;

    if (isPoolError) console.error(isPoolError);

    return useMemo(() => {
        if (isPoolError) return [PoolState.INVALID, null];
        if (isPoolLoading || isJettonsLoading) return [PoolState.LOADING, null];
        if (!poolData?.tick_spacing || poolData?.liquidity === undefined) return [PoolState.NOT_EXISTS, null];

        // const ONE_ETHER = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18));
        // const NEGATIVE_ONE = JSBI.BigInt(-1);

        // const tickDataProvider = [
        //     {
        //         index: nearestUsableTick(TickMath.MIN_TICK, 60),
        //         liquidityNet: ONE_ETHER,
        //         liquidityGross: ONE_ETHER,
        //     },
        //     {
        //         index: nearestUsableTick(TickMath.MAX_TICK, 60),
        //         liquidityNet: JSBI.multiply(ONE_ETHER, NEGATIVE_ONE),
        //         liquidityGross: ONE_ETHER,
        //     },
        // ];
        const pool = new Pool(jetton0, jetton1, 100, poolData.price_sqrt.toString(), poolData.liquidity.toString(), poolData.tick, 60);

        return [PoolState.EXISTS, pool];
    }, [isPoolLoading, isJettonsLoading, isPoolError, poolData, jetton0, jetton1]);
}
