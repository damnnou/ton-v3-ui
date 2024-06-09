import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useAsyncInitialize } from "./useAsyncInitialize";
import TonWeb from "tonweb";
import { useTonConnect } from "./useTonConnect";
import { CHAIN } from "@tonconnect/ui-react";

export function useTonClient() {
    const { network } = useTonConnect();

    return useAsyncInitialize(async () => {
        const endpoint = await getHttpEndpoint({
            network: network === CHAIN.TESTNET ? "testnet" : "mainnet",
        });
        const client = new TonWeb(new TonWeb.HttpProvider(endpoint));
        return client;
    }, [network]);
}
