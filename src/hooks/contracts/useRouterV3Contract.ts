import { useAsyncInitialize } from "../common/useAsyncInitialize";
import { Address, OpenedContract } from "@ton/core";
import { useTonClient } from "../common/useTonClient";
import { RouterV3Contract } from "src/sdk/src/contracts/RouterV3Contract";

export function useRouterV3Contract(routerAddress: string | undefined) {
    const client = useTonClient();

    const routerV3Contract = useAsyncInitialize(async () => {
        if (!client || !routerAddress) return;

        const contract = new RouterV3Contract(Address.parse(routerAddress));

        return client.open(contract) as OpenedContract<RouterV3Contract>;
    }, [client, routerAddress]);

    return routerV3Contract;
}
