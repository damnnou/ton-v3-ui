import { useAsyncInitialize } from "../common/useAsyncInitialize";
import { Address, OpenedContract } from "@ton/core";
import { useTonClient } from "../common/useTonClient";
import { JettonMinter } from "src/sdk/src/contracts/common/JettonMinter";

export function useJettonMinterContract(jettonMinter: string | undefined) {
    const client = useTonClient();

    const poolV3Contract = useAsyncInitialize(async () => {
        if (!client || !jettonMinter) return;

        const contract = new JettonMinter(Address.parse(jettonMinter));

        return client.open(contract) as OpenedContract<JettonMinter>;
    }, [client, jettonMinter]);

    return poolV3Contract;
}
