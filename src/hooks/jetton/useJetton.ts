import { AddressType } from "@ston-fi/sdk";
import { useEffect, useState } from "react";
import { useTonConnect } from "../common/useTonConnect";
import { useJettonWalletContract } from "../contracts/useJettonWalletContract";
import { Jetton, jettons } from "src/constants/jettons";
import TonWeb from "tonweb";

export function useJettonByJettonWallet(jettonWalletAddress: AddressType | undefined) {
    const [jettonAddress, setJettonAddress] = useState<AddressType>();

    const jettonWallet = useJettonWalletContract(jettonWalletAddress);

    const jetton = useJetton(jettonAddress);

    useEffect(() => {
        if (!jettonWallet) return;

        jettonWallet.getData().then((data) => setJettonAddress(data.jettonMinterAddress.toString(false)));
    }, [jettonWallet]);

    return jetton;
}

export function useJetton(jettonAddress: AddressType | undefined) {
    const [jetton, setJetton] = useState<Jetton>();
    const { network } = useTonConnect();

    useEffect(() => {
        if (!network || !jettonAddress) return;
        Object.entries(jettons[network]).map(
            ([, jetton]) =>
                new TonWeb.utils.Address(jetton.address).toString(false) === new TonWeb.utils.Address(jettonAddress).toString(false) &&
                setJetton(jetton)
        );
    }, [network, jettonAddress]);

    return jetton;
}
