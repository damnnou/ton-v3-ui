import { useAsyncInitialize } from "../common/useAsyncInitialize";
import { Address, OpenedContract } from "@ton/core";
import { useTonClient } from "../common/useTonClient";
import { JettonWallet } from "src/sdk/src/contracts/common/JettonWallet";

export function useJettonWalletContract(jettonWallet: string | undefined) {
    const client = useTonClient();

    const poolV3Contract = useAsyncInitialize(async () => {
        if (!client || !jettonWallet) return;

        const contract = new JettonWallet(Address.parse(jettonWallet));

        return client.open(contract) as OpenedContract<JettonWallet>;
    }, [client, jettonWallet]);

    return poolV3Contract;
}
