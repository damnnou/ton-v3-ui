import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useAsyncInitialize } from "./useAsyncInitialize";
import TonWeb from "tonweb";

export function useTonClient() {
    return useAsyncInitialize(async () => {
        const endpoint = await getHttpEndpoint();
        const client = new TonWeb(new TonWeb.HttpProvider(endpoint));
        return client;
    });
}
