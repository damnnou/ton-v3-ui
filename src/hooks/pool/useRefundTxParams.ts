import { useEffect, useState } from "react";
import { useTonConnect } from "../common/useTonConnect";
import { useRouterContract } from "../contracts/useRouterContract";
import { MessageData } from "@ston-fi/sdk";
import { Pool } from "./usePool";

export function useRefundTxParams(pool: Pool) {
    const [txParams, setTxParams] = useState<MessageData[]>();

    const { wallet } = useTonConnect();
    const router = useRouterContract();

    useEffect(() => {
        if (!wallet || !router) return;
        const getRefundTxParams = async () => {
            const poolContract = await router.getPool({ token0: pool.token0.address, token1: pool.token1.address });
            const lpAccount = await poolContract?.getLpAccount({ ownerAddress: wallet });
            return await lpAccount?.buildRefundTxParams();
        };

        getRefundTxParams().then((data) => data && setTxParams([data]));
    }, [wallet, router, pool]);

    return txParams;
}
