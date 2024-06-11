import TonWeb, { AddressType } from "tonweb";
import { usePoolContract } from "../contracts/usePoolContract";
import { useEffect, useState } from "react";
import { useTonConnect } from "../common/useTonConnect";
import { BN } from "@ston-fi/sdk";

export interface Position {
    userAddress: AddressType;
    poolAddress: AddressType;
    amount0: BN;
    amount1: BN;
    lpAmount: BN;
}

export function usePosition(poolAddress: AddressType | undefined) {
    const [position, setPosition] = useState<Position>();
    const pool = usePoolContract(poolAddress);
    const { wallet } = useTonConnect();

    useEffect(() => {
        if (!pool || !wallet) return;
        const getPositionData = async () => {
            const lpTokenWallet = await pool.getJettonWallet({ ownerAddress: wallet });
            const lpTokenWalletData = await lpTokenWallet.getData();

            const poolAddress = lpTokenWalletData.jettonMinterAddress.toString(true);

            const { amount0, amount1 } = await pool.getExpectedLiquidity({ jettonAmount: lpTokenWalletData.balance });
            return {
                userAddress: new TonWeb.utils.Address(wallet).toString(true),
                poolAddress,
                amount0,
                amount1,
                lpAmount: lpTokenWalletData.balance,
            };
        };

        getPositionData().then(setPosition);
    }, [pool, wallet]);

    return position;
}
