import { useEffect, useState } from "react";
import { useRouterContract } from "../contracts/useRouterContract";
import { useTonConnect } from "../common/useTonConnect";
import { Jetton, jettons } from "src/constants/jettons";
import { MessageData } from "@ston-fi/sdk";
import { isTON } from "src/utils/common/isTON";
import { parseUnits } from "src/utils/common/parseUnits";
import { CHAIN } from "@tonconnect/ui-react";
import { toNano } from "ton-core";
import TonWeb from "tonweb";

enum TokenTypes {
    TON_TO_JETTON = "TON_TO_JETTON",
    JETTON_TO_TON = "JETTON_TO_TON",
    JETTON_TO_JETTON = "JETTON_TO_JETTON",
}

function getTokenTypes(offerJetton: Jetton, askJetton: Jetton, network: CHAIN): TokenTypes {
    if (isTON(offerJetton.address, network)) {
        return TokenTypes.TON_TO_JETTON;
    }

    if (isTON(askJetton.address, network)) {
        return TokenTypes.JETTON_TO_TON;
    }

    return TokenTypes.JETTON_TO_JETTON;
}

export function useProvideLiquidityTxParams({
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
    const [txsParams, setTxsParams] = useState<MessageData[]>();

    const router = useRouterContract();

    const { wallet, network } = useTonConnect();

    useEffect(() => {
        if (!wallet || !router || !minAskAmount || !offerAmount || !network) {
            setTxsParams(undefined);
            return;
        }

        const tokenTypes = getTokenTypes(offerJetton, askJetton, network);

        switch (tokenTypes) {
            case TokenTypes.TON_TO_JETTON:
                Promise.all([
                    router.buildProvideLiquidityTonTxParams({
                        userWalletAddress: wallet,
                        proxyTonAddress: jettons[network].TON.address,
                        sendAmount: toNano(offerAmount),
                        otherTokenAddress: askJetton.address,
                        minLpOut: new TonWeb.utils.BN("1"), // TODO: get minLpOut
                    }),
                    router.buildProvideLiquidityJettonTxParams({
                        userWalletAddress: wallet,
                        sendTokenAddress: askJetton.address,
                        sendAmount: parseUnits(minAskAmount, askJetton.decimals),
                        otherTokenAddress: jettons[network].TON.address,
                        minLpOut: new TonWeb.utils.BN("1"), // TODO: get minLpOut
                    }),
                ]).then(setTxsParams);
                break;

            case TokenTypes.JETTON_TO_TON:
                Promise.all([
                    router.buildProvideLiquidityTonTxParams({
                        userWalletAddress: wallet,
                        proxyTonAddress: jettons[network].TON.address,
                        sendAmount: toNano(offerAmount),
                        otherTokenAddress: askJetton.address,
                        minLpOut: new TonWeb.utils.BN("1"), // TODO: get minLpOut
                    }),
                    router.buildProvideLiquidityJettonTxParams({
                        userWalletAddress: wallet,
                        sendTokenAddress: offerJetton.address,
                        sendAmount: parseUnits(offerAmount, offerJetton.decimals),
                        otherTokenAddress: jettons[network].TON.address,
                        minLpOut: new TonWeb.utils.BN("1"), // TODO: get minLpOut
                    }),
                ]).then(setTxsParams);
                break;

            case TokenTypes.JETTON_TO_JETTON:
                Promise.all([
                    router.buildProvideLiquidityJettonTxParams({
                        userWalletAddress: wallet,
                        sendTokenAddress: offerJetton.address,
                        sendAmount: parseUnits(offerAmount, offerJetton.decimals),
                        otherTokenAddress: askJetton.address,
                        minLpOut: new TonWeb.utils.BN("1"), // TODO: get minLpOut
                    }),
                    router.buildProvideLiquidityJettonTxParams({
                        userWalletAddress: wallet,
                        sendTokenAddress: askJetton.address,
                        sendAmount: parseUnits(minAskAmount, askJetton.decimals),
                        otherTokenAddress: offerJetton.address,
                        minLpOut: new TonWeb.utils.BN("1"), // TODO: get minLpOut
                    }),
                ]).then(setTxsParams);
                break;

            default:
                break;
        }
    }, [router, wallet, askJetton, offerJetton, offerAmount, minAskAmount, network]);

    return txsParams;
}
