import { AddressType } from "@ston-fi/sdk";
import { useEffect, useState } from "react";
import { useJettonWalletContract } from "../contracts/useJettonWalletContract";
import { Jetton } from "src/constants/jettons";
import { useTonConsoleClient } from "../common/useTonConsoleClient";
import { useTokensState } from "src/state/tokensStore";

export function useJettonByJettonWallet(jettonWalletAddress: AddressType | undefined) {
    const [jettonAddress, setJettonAddress] = useState<AddressType>();

    const jettonWallet = useJettonWalletContract(jettonWalletAddress);

    const jetton = useJetton(jettonAddress);

    useEffect(() => {
        if (!jettonWallet) return;

        jettonWallet.getData().then((data) => setJettonAddress(data.jettonMinterAddress));
    }, [jettonWallet]);

    return jetton;
}

export function useJetton(jettonAddress: AddressType | undefined) {
    const [jetton, setJetton] = useState<Jetton>();
    const { importedTokens } = useTokensState();
    const client = useTonConsoleClient();

    useEffect(() => {
        if (!jettonAddress || !client) return;
        const allTokens = Object.values(importedTokens);
        const token = allTokens.find((jetton) => jetton.address.toString(false) === jettonAddress.toString(false));
        if (token) {
            setJetton(token);
            return;
        }

        client.jettons.getJettonInfo(jettonAddress.toString(false)).then(({ metadata }) => {
            setJetton({
                name: metadata.name,
                address: jettonAddress,
                symbol: metadata.symbol === "pTON" ? "TON" : metadata.symbol === "☯" ? "tSTON" : metadata.symbol,
                image: metadata.image,
                decimals: Number(metadata.decimals),
            });
        });
    }, [jettonAddress, client, importedTokens]);

    return jetton;
}
