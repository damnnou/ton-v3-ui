import { useMemo } from "react";
import { AddressType } from "tonweb";
import { useTonClient } from "../common/useTonClient";
import { JettonWallet } from "src/contracts/JettonWallet";

export function useJettonWalletContract(jettonWalletAddress: AddressType | undefined) {
    const tonApiClient = useTonClient();

    return useMemo(() => {
        if (!tonApiClient || !jettonWalletAddress) return;

        return new JettonWallet(tonApiClient.provider, {
            address: jettonWalletAddress,
        });
    }, [tonApiClient, jettonWalletAddress]);
}
