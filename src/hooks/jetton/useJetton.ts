import { AddressType } from "@ston-fi/sdk";
import { useEffect, useState } from "react";
import { useJettonWalletContract } from "../contracts/useJettonWalletContract";
import { useTonConsoleClient } from "../common/useTonConsoleClient";
import { useTokensState } from "src/state/tokensStore";
import { Jetton } from "src/sdk/src/TON/entities/Jetton";

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

export function useJetton(jettonAddress: AddressType | undefined): Jetton | undefined {
    const [jetton, setJetton] = useState<Jetton>();
    const { importedTokens } = useTokensState();
    const client = useTonConsoleClient();

    useEffect(() => {
        if (!jettonAddress || !client) return;
        const allTokens = Object.values(importedTokens);
        const token = allTokens.find((jetton) => jetton.address.toString(false) === jettonAddress.toString(false));
        if (token) {
            setJetton(new Jetton(token.address.toString(false), token.decimals, token.symbol, token.name));
            return;
        }

        client.jettons.getJettonInfo(jettonAddress.toString(false)).then(({ metadata }) => {
            setJetton(new Jetton(jettonAddress.toString(false), Number(metadata.decimals), metadata.symbol, metadata.name));
        });
    }, [jettonAddress, client, importedTokens]);

    return jetton;
}
