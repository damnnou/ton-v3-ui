import { useEffect, useState } from "react";
import { usePoolContract } from "../contracts/usePoolContract";
import { useTonConnect } from "../common/useTonConnect";
import { MessageData } from "@ston-fi/sdk";
import { Position } from "../position/usePosition";

export function useBurnLiquidityTxParams({ position, percent }: { position: Position | undefined; percent: number | undefined }) {
    const [txParams, setTxParams] = useState<MessageData[]>();
    const { wallet } = useTonConnect();
    const pool = usePoolContract(position?.poolAddress);

    useEffect(() => {
        if (!pool || !wallet || !percent || !position) return;
        setTxParams(undefined);
        pool.buildBurnTxParams({
            amount: (position?.lpAmount * percent) / 100,
            responseAddress: wallet,
        }).then((params) => setTxParams([params]));
    }, [pool, wallet, percent, position]);

    return txParams;
}
