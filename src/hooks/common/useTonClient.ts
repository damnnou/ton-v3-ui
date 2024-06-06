import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useAsyncInitialize } from "./useAsyncInitialize";
import TonWeb from "tonweb";

// get the decentralized RPC endpoint
const endpoint = await getHttpEndpoint();

const client = new TonWeb.HttpProvider(endpoint);

export function useTonClient() {
    return useAsyncInitialize(async () => client);
}
