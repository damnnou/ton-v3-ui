import { useAsyncInitialize } from "../common/useAsyncInitialize";
import { Address, OpenedContract } from "@ton/core";
import { useTonClient } from "../common/useTonClient";
import { PoolV3Contract } from "src/sdk/src/contracts/PoolV3Contract";

export function usePoolV3Contract(poolAddress: string | undefined) {
    const client = useTonClient();

    const poolV3Contract = useAsyncInitialize(async () => {
        if (!client || !poolAddress) return;

        const contract = new PoolV3Contract(Address.parse(poolAddress));

        return client.open(contract) as OpenedContract<PoolV3Contract>;
    }, [client, poolAddress]);

    return poolV3Contract;
}
