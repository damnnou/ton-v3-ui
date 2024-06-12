import { useEffect, useState } from "react";
import { AddressType } from "tonweb";
import { useRouterContract } from "../contracts/useRouterContract";
import { Jetton } from "src/constants/jettons";
import { BN } from "@ston-fi/sdk";
import { useJetton, useJettonByJettonWallet } from "../jetton/useJetton";
import { usePoolContract } from "../contracts/usePoolContract";

export interface Pool {
    address: AddressType | undefined;
    token0: Jetton;
    token1: Jetton;
    reserve0: BN;
    reserve1: BN;
    token0WalletAddress: AddressType;
    token1WalletAddress: AddressType;
    lpFee: BN;
    protocolFee: BN;
    refFee: BN;
    protocolFeeAddress: AddressType | null;
    collectedToken0ProtocolFee: BN;
    collectedToken1ProtocolFee: BN;
}

export function usePoolByTokens({
    token0,
    token1,
}: {
    token0: AddressType | undefined;
    token1: AddressType | undefined;
}): Pool | undefined {
    const [pool, setPool] = useState<Pool>();

    const router = useRouterContract();

    const jetton0 = useJetton(token0);
    const jetton1 = useJetton(token1);

    useEffect(() => {
        if (!jetton0 || !jetton1 || !router) return;

        const getPoolData = async () => {
            const pool = await router.getPool({ token0: jetton0.address, token1: jetton1.address });

            if (!pool) return;
            const poolData = await pool.getData();
            return { ...poolData, token0: jetton0, token1: jetton1, address: pool.address?.toString(true) };
        };

        getPoolData()
            .then(setPool)
            .catch(() => setPool(undefined));
    }, [jetton0, jetton1, router]);

    return pool;
}

export function usePool(address: AddressType | undefined): Pool | undefined {
    const [poolData, setPoolData] = useState<any>();
    const poolContract = usePoolContract(address);

    const token0 = useJettonByJettonWallet(poolData?.token0WalletAddress);
    const token1 = useJettonByJettonWallet(poolData?.token1WalletAddress);

    useEffect(() => {
        if (!poolContract) return;

        poolContract.getData().then(setPoolData);
    }, [poolContract]);

    if (!token0 || !token1) return;

    return { ...poolData, token0, token1, address: poolContract?.address };
}
