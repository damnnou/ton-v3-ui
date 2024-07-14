import { usePoolV3Contract } from "../contracts/usePoolV3Contract";
import JSBI from "jsbi";
import { Address, OpenedContract } from "@ton/core";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { PoolV3Contract } from "src/sdk/src/contracts/PoolV3Contract";
import useSWR from "swr";
import { PoolState, PoolStateType } from "src/types/pool-state";
import { useMemo, useState } from "react";
import { useJettonByJettonWallet } from "../jetton/useJetton";
import { Pool as PoolSDK } from "src/sdk/src";

export interface Pool {
    jetton0: Jetton;
    jetton1: Jetton;

    jetton0_wallet: Address;
    jetton1_wallet: Address;
    poolActive: boolean;
    tickSpacing: number;

    tickCurrent: number;
    sqrtRatioX96: JSBI | bigint;
    liquidity: JSBI | bigint;

    nftv3item_counter: number;

    // prevTick: number;
    // nextTick: number;
    // tick: TickInfoWrapper;
    // lp_fee_base: number;
    // protocol_fee: number;
    // lp_fee_current: number;
    // balance: number;
}

const fetchPoolData = (poolContract: OpenedContract<PoolV3Contract> | undefined) => {
    return poolContract?.getPoolStateAndConfiguration();
};

export function usePoolV3(poolAddres: string | undefined): [PoolStateType, PoolSDK | null] {
    const poolContract = usePoolV3Contract(poolAddres);
    const [jettonWallets, setJettonWallets] = useState<string[]>();

    const jetton0 = useJettonByJettonWallet(jettonWallets?.[0]);
    const jetton1 = useJettonByJettonWallet(jettonWallets?.[1]);

    const {
        data: poolData,
        error: isPoolError,
        isLoading: isPoolLoading,
    } = useSWR(["poolData", poolContract], () => fetchPoolData(poolContract), {
        revalidateOnFocus: false,
        revalidateOnMount: false,
        onSuccess(data) {
            if (data) setJettonWallets([data.jetton0_wallet.toString(), data.jetton1_wallet.toString()]);
        },
    });

    const isJettonsLoading = !jetton0 || !jetton1;

    if (isPoolError) console.error(isPoolError);

    return useMemo(() => {
        if ((isPoolLoading || isJettonsLoading) && !isPoolError) return [PoolState.LOADING, null];
        if (!poolData?.tick_spacing || poolData?.liquidity === undefined || !jetton0 || !jetton1) return [PoolState.NOT_EXISTS, null];
        if (poolData.pool_active === false) return [PoolState.INVALID, null];

        const pool = {
            jetton0,
            jetton1,

            jetton0_wallet: poolData.jetton0_wallet,
            jetton1_wallet: poolData.jetton1_wallet,
            poolActive: poolData.pool_active,
            tickSpacing: poolData.tick_spacing,

            tickCurrent: poolData.tick,
            sqrtRatioX96: poolData.price_sqrt,
            liquidity: poolData.liquidity,

            nftv3item_counter: poolData.nftv3item_counter,
        };

        const poolSDK = new PoolSDK(
            jetton0,
            jetton1,
            100,
            poolData.price_sqrt.toString(),
            poolData.liquidity.toString(),
            poolData.tick,
            60
        );

        return [PoolState.EXISTS, poolSDK];
    }, [isPoolLoading, isJettonsLoading, isPoolError, poolData, jetton0, jetton1]);
}
