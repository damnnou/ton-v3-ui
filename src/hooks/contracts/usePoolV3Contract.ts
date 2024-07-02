import { PoolV3Contract } from "src/contracts/PoolV3";
import { useAsyncInitialize } from "../common/useAsyncInitialize";
import { Address, OpenedContract } from "ton-core";
import { useTonClientV3 } from "../common/useTonClientV3";

export function usePoolV3Contract(pool: string | undefined) {
    const client = useTonClientV3();

    const poolV3Contract = useAsyncInitialize(async () => {
        if (!client || !pool) return;

        const contract = new PoolV3Contract(Address.parse(pool));

        return client.open(contract) as OpenedContract<PoolV3Contract>;
    }, [client, pool]);

    return poolV3Contract;
}
