import { useState, useEffect } from "react";
import { formatUnits } from "src/utils/common/formatUnits";
import { useTonConnect } from "../common/useTonConnect";
import { useRouterContract } from "../contracts/useRouterContract";
import { Pool } from "./usePool";

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useUserReserves(pool: Pool) {
    const [userReserve0, setUserReserve0] = useState<number>();
    const [userReserve1, setUserReserve1] = useState<number>();

    const { wallet } = useTonConnect();
    const router = useRouterContract();

    useEffect(() => {
        if (!pool || !wallet || !router) return;
        const getUserReserves = async () => {
            /* avoid too many requests */
            await delay(2500);

            const poolContract = await router.getPool({ token0: pool.token0.address, token1: pool.token1.address });

            const lpAccount = await poolContract?.getLpAccount({ ownerAddress: wallet });
            return await lpAccount?.getData();
        };

        getUserReserves().then((data) => {
            if (!data) return;
            setUserReserve0(formatUnits(data.amount0, pool.token0.decimals));
            setUserReserve1(formatUnits(data.amount1, pool.token1.decimals));
        });
    }, [pool, wallet, router]);

    return [userReserve0, userReserve1];
}
