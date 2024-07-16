import { useCallback, useMemo } from "react";
// import { Pool } from "../pool/usePoolV3";
import { Address, beginCell, SendMode, toNano } from "@ton/core";
import { ContractOpcodes } from "src/sdk/src/contracts/opCodes";
import { parseUnits } from "src/utils/common/parseUnits";
import { useTonConnect } from "../common/useTonConnect";
import { useJettonWalletAddress } from "../jetton/useJettonWalletAddress";
import { ROUTER } from "src/constants/addresses";
import { SwapCallbackState } from "src/types/swap-state";
import { Pool, TickMath } from "src/sdk/src";
import { JettonWallet } from "src/sdk/src/contracts/common/JettonWallet";

export function useSwapCallback({
    pool,
    amountIn,
    amountOut,
}: {
    pool: Pool | null | undefined;
    amountIn: string | undefined;
    amountOut: string | undefined;
}) {
    const { sender, wallet } = useTonConnect();

    const jetton0Wallet = useJettonWalletAddress({ jettonAddress: pool?.jetton0.address, ownerAddress: wallet });
    const jetton1Wallet = useJettonWalletAddress({ jettonAddress: pool?.jetton1.address, ownerAddress: wallet });

    const routerJetton1Wallet = useJettonWalletAddress({ jettonAddress: pool?.jetton1.address, ownerAddress: ROUTER });

    const swapCallback = useCallback(() => {
        if (!wallet || !jetton0Wallet || !routerJetton1Wallet || !amountIn || !pool || !jetton1Wallet) {
            console.log(jetton0Wallet, routerJetton1Wallet, wallet, amountIn, pool);
            return;
        }
        const amountToChange = parseUnits(Number(amountIn), pool.jetton0.decimals);

        const swapRequest = beginCell()
            .storeUint(ContractOpcodes.POOLV3_SWAP, 32) // Request to swap
            .storeAddress(Address.parse(routerJetton1Wallet)) // JettonWallet attached to Router is used to identify target token
            .storeUint(BigInt(TickMath.MIN_SQRT_RATIO.toString()), 160) // Minium price that we are ready to reach
            .storeAddress(Address.parse(wallet)) // Address to recieve result of the swap
            .endCell();

        const payload = JettonWallet.transferMessage(
            amountToChange,
            Address.parse(ROUTER),
            Address.parse(wallet),
            beginCell().endCell(),
            toNano(0.2),
            swapRequest
        );

        sender.send({
            to: Address.parse(jetton0Wallet),
            value: toNano(1.0),
            body: payload,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        });
    }, [wallet, jetton0Wallet, routerJetton1Wallet, amountIn, pool, jetton1Wallet, sender]);

    return useMemo(() => {
        return {
            state: SwapCallbackState.VALID,
            callback: swapCallback,
            error: null,
        };
    }, [swapCallback]);
}
