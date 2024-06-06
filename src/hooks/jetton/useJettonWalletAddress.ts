import { useEffect, useState } from "react";
import TonWeb, { AddressType } from "tonweb";
import { HttpProvider } from "tonweb/dist/types/providers/http-provider";
import { useJettonMinterContract } from "../contracts/useJettonMinterContract";

interface Props {
    jettonAddress: AddressType;
    ownerAddress: AddressType;
    client: HttpProvider;
}

const Address = TonWeb.Address;

export function useJettonWalletAddress({ jettonAddress, ownerAddress }: Partial<Props>) {
    const [jettonWalletAddress, setJettonWalletAddress] = useState<AddressType>();

    const jettonMinter = useJettonMinterContract(jettonAddress);

    useEffect(() => {
        if (!jettonAddress || !ownerAddress || !jettonMinter) return;

        jettonMinter.getJettonWalletAddress(new Address(ownerAddress)).then(setJettonWalletAddress);
    }, [jettonAddress, ownerAddress, jettonMinter]);

    return jettonWalletAddress;
}
