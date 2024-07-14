import { useCallback, useMemo } from "react";
// import { Pool } from "../pool/usePoolV3";
import { Address, beginCell, toNano } from "@ton/core";
import { ContractOpcodes } from "src/sdk/src/contracts/opCodes";
import { parseUnits } from "src/utils/common/parseUnits";
import { useTonConnect } from "../common/useTonConnect";
import { useJettonWalletContract } from "../contracts/useJettonWalletContract";
import { useJettonWalletAddress } from "../jetton/useJettonWalletAddress";
import { ROUTER } from "src/constants/addresses";
import { SwapCallbackState } from "src/types/swap-state";
import { Pool } from "src/sdk/src";

export function useSwapCallback({
    pool,
    amountIn,
    amountOut,
}: {
    pool: Pool | null;
    amountIn: string | undefined;
    amountOut: string | undefined;
}) {
    const { sender, wallet } = useTonConnect();

    const jetton0Wallet = useJettonWalletAddress({ jettonAddress: pool?.jetton0.address, ownerAddress: wallet });
    const jetton1Wallet = useJettonWalletAddress({ jettonAddress: pool?.jetton1.address, ownerAddress: wallet });
    const jetton0WalletContract = useJettonWalletContract(jetton0Wallet);

    const swapRequest =
        wallet &&
        pool &&
        amountOut &&
        jetton1Wallet &&
        beginCell()
            .storeUint(ContractOpcodes.POOLV3_SWAP, 32) // Request to swap
            .storeAddress(Address.parse(jetton1Wallet)) // JettonWallet attached to Router is used to identify target token
            .storeCoins(parseUnits(Number(amountOut), pool.jetton1.decimals)) // Minimum amount the we agree to get back
            .storeAddress(Address.parse(wallet)) // Address to receive result of the swap
            .endCell();

    const swapCallback = useCallback(() => {
        if (!swapRequest || !wallet || !jetton0WalletContract || !amountIn) return;
        const amountToChange = parseUnits(Number(amountIn), pool.jetton0.decimals);

        jetton0WalletContract.sendTransfer(
            sender,
            toNano(1.0),
            amountToChange,
            Address.parse(ROUTER),
            Address.parse(wallet),
            beginCell().endCell(),
            toNano(0.2),
            swapRequest
        );

        // const payload = JettonWallet.transferMessage(parseUnits(Number(amountIn), inputCurrency.decimals), ROUTER_ADDRESS, Address.parse(wallet), beginCell().endCell(), toNano(0.2), swapRequest)

        // sender.send({
        //     to: ROUTER_ADDRESS,
        //     value: toNano(1.0),
        //     body: payload,
        // })
    }, [swapRequest, wallet, jetton0WalletContract, amountIn, pool, sender]);

    return useMemo(() => {
        return {
            state: SwapCallbackState.VALID,
            callback: swapCallback,
            error: null,
        };
    }, [swapCallback]);
}
