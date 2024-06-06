import { useEffect, useState } from "react";
import { useRouterContract } from "../contracts/useRouterContract";
import { useTonConnect } from "../common/useTonConnect";
import { Jetton, jettons } from "src/constants/jettons";
import { MessageData } from "@ston-fi/sdk";
import TonWeb from "tonweb";
import { toNano } from "ton-core";

const {
    utils: { BN },
} = TonWeb;

export function useSwapTonToJettonTxParams(askJetton: Jetton, minAskAmount: number | undefined, offerAmount: number | undefined) {
    const [txParams, setTxParams] = useState<MessageData>();

    const router = useRouterContract();

    const { wallet } = useTonConnect();

    useEffect(() => {
        if (!wallet || !router || !minAskAmount || !offerAmount) return;
        router
            .buildSwapTonToJettonTxParams({
                userWalletAddress: wallet,
                proxyTonAddress: jettons.TON.address,
                offerAmount: toNano(offerAmount),
                askJettonAddress: askJetton.address,
                minAskAmount: new BN(minAskAmount * 10 ** askJetton.decimals),
            })
            .then(setTxParams);
    }, [router, wallet, askJetton, offerAmount, minAskAmount]);

    return txParams;
}
