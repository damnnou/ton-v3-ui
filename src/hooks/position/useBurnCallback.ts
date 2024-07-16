import { useCallback, useMemo } from "react";
import { toNano } from "@ton/core";
import { useTonConnect } from "../common/useTonConnect";
import { SwapCallbackState } from "src/types/swap-state";
import { Position } from "src/sdk/src";
import { usePositionNFTV3Contract } from "../contracts/usePositionNFTV3Contract";

export function useBurnCallback({ nftAddress }: { position?: Position; nftAddress: string }) {
    const { sender, wallet } = useTonConnect();

    const positionNFTV3Contract = usePositionNFTV3Contract(nftAddress);

    const burnCallback = useCallback(async () => {
        if (!wallet || !positionNFTV3Contract || !sender) return;

        positionNFTV3Contract.sendBurn(sender, {
            value: toNano("1.0"),
        });
    }, [wallet, positionNFTV3Contract, sender]);

    return useMemo(() => {
        return {
            state: SwapCallbackState.VALID,
            callback: burnCallback,
            error: null,
        };
    }, [burnCallback]);
}
