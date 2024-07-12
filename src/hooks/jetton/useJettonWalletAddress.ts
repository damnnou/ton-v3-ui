import { useEffect, useState } from "react";
import { useJettonMinterContract } from "../contracts/useJettonMinterContract";
import { Address } from "@ton/core";

interface Props {
    jettonAddress: string | undefined;
    ownerAddress: string | null | undefined;
}

export function useJettonWalletAddress({ jettonAddress, ownerAddress }: Props) {
    const [jettonWalletAddress, setJettonWalletAddress] = useState<string>();

    const jettonMinter = useJettonMinterContract(jettonAddress);

    useEffect(() => {
        if (!jettonAddress || !ownerAddress || !jettonMinter) return;

        jettonMinter
            .getWalletAddress(Address.parse(ownerAddress))
            .then((jettonWalletAddress) => setJettonWalletAddress(jettonWalletAddress.toString()));
    }, [jettonAddress, ownerAddress, jettonMinter]);

    return jettonWalletAddress;
}
