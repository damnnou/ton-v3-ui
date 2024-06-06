import { useMemo } from "react";
import { AddressType } from "tonweb";
import { useTonClient } from "../common/useTonClient";
import { JettonMinter } from "src/contracts/JettonMinter";

export function useJettonMinterContract(jettonAddress: AddressType | undefined) {
    const tonApiClient = useTonClient();

    return useMemo(() => {
        if (!tonApiClient || !jettonAddress) return;

        return new JettonMinter(
            tonApiClient,
            // @ts-expect-error - not all parameters are really required here
            {
                address: jettonAddress,
            }
        );
    }, [tonApiClient, jettonAddress]);
}
