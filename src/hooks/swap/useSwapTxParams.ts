import { useEffect, useState } from "react";
import { useRouterContract } from "../contracts/useRouterContract";
import { useTonConnect } from "../common/useTonConnect";
import { Jetton, jettons } from "src/constants/jettons";
import { MessageData } from "@ston-fi/sdk";
import { toNano } from "ton-core";
import { isTON } from "src/utils/isTON";
import { parseUnits } from "src/utils/parseUnits";

enum SwapType {
    TON_TO_JETTON = "TON_TO_JETTON",
    JETTON_TO_TON = "JETTON_TO_TON",
    JETTON_TO_JETTON = "JETTON_TO_JETTON",
}

function getSwapType(offerJetton: Jetton, askJetton: Jetton): SwapType {
    if (isTON(offerJetton.address)) {
        return SwapType.TON_TO_JETTON;
    }

    if (isTON(askJetton.address)) {
        return SwapType.JETTON_TO_TON;
    }

    return SwapType.JETTON_TO_JETTON;
}

export function useSwapTxParams({
    offerJetton,
    askJetton,
    offerAmount,
    minAskAmount,
}: {
    offerJetton: Jetton;
    askJetton: Jetton;
    offerAmount: number | undefined;
    minAskAmount: number | undefined;
}) {
    const [txParams, setTxParams] = useState<MessageData>();

    const router = useRouterContract();

    const { wallet } = useTonConnect();

    useEffect(() => {
        if (!wallet || !router || !minAskAmount || !offerAmount) return;
        const swapType = getSwapType(offerJetton, askJetton);

        switch (swapType) {
            case SwapType.TON_TO_JETTON:
                router
                    .buildSwapTonToJettonTxParams({
                        userWalletAddress: wallet,
                        proxyTonAddress: jettons.TON.address,
                        offerAmount: toNano(offerAmount),
                        askJettonAddress: askJetton.address,
                        minAskAmount: parseUnits(minAskAmount, askJetton.decimals),
                    })
                    .then(setTxParams);
                break;

            case SwapType.JETTON_TO_TON:
                router
                    .buildSwapJettonToTonTxParams({
                        userWalletAddress: wallet,
                        proxyTonAddress: jettons.TON.address,
                        offerJettonAddress: offerJetton.address,
                        offerAmount: parseUnits(offerAmount, offerJetton.decimals),
                        minAskAmount: toNano(minAskAmount),
                    })
                    .then(setTxParams);
                break;

            case SwapType.JETTON_TO_JETTON:
                router
                    .buildSwapJettonToJettonTxParams({
                        userWalletAddress: wallet,
                        offerJettonAddress: offerJetton.address,
                        offerAmount: parseUnits(offerAmount, offerJetton.decimals),
                        askJettonAddress: askJetton.address,
                        minAskAmount: parseUnits(minAskAmount, askJetton.decimals),
                    })
                    .then(setTxParams);
                break;

            default:
                break;
        }
    }, [router, wallet, askJetton, offerJetton, offerAmount, minAskAmount]);

    return txParams;
}
