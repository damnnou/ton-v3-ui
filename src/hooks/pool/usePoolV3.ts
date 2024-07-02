import { usePoolV3Contract } from "../contracts/usePoolV3Contract";
import JSBI from "jsbi";
import { useEffect, useState } from "react";
import { Address } from "ton-core";
import { useJetton } from "../jetton/useJetton";
import { Jetton } from "src/sdk/src/TON/entities/Jetton";

interface Pool {
    jetton0: Jetton;
    jetton1: Jetton;
    sqrtRatioX96: JSBI | bigint;
    liquidity: JSBI | bigint;
    tickCurrent: number;
    // tickDataProvider: TickDataProvider;
    tickSpacing: number;
}

export function usePoolV3(poolAddres: string | undefined): Pool | undefined {
    const [token0Address, setToken0Address] = useState<Address>();
    const [token1Address, setToken1Address] = useState<Address>();
    const [poolData, setPoolData] = useState<Pool>();

    const poolContract = usePoolV3Contract(poolAddres);

    const jetton0 = useJetton(token0Address?.toString());
    const jetton1 = useJetton(token1Address?.toString());

    useEffect(() => {
        if (!poolContract || (jetton0 && jetton1)) return;
        poolContract.getTokenAddresses().then(({ token0_address, token1_address }) => {
            setToken0Address(token0_address);
            setToken1Address(token1_address);
        });
    }, [poolContract, jetton0, jetton1]);

    useEffect(() => {
        if (!poolContract || !poolAddres || !jetton0 || !jetton1) return;

        const fetchData = async () => {
            const { liquidity, priceSqrt: sqrtRatioX96 } = await poolContract.getPriceAndLiquidity();
            const tickCurrent = await poolContract.getTick();

            setPoolData({
                jetton0,
                jetton1,
                sqrtRatioX96,
                liquidity,
                tickCurrent,
                // tickDataProvider: new NoTickDataProvider(),
                tickSpacing: 60,
            });
        };

        fetchData();
    }, [poolContract, poolAddres, jetton0, jetton1]);

    return poolData;
}
