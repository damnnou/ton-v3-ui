import React, { createContext, useContext, useState } from "react";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import TonWeb from "tonweb";
import { useTonConnect } from "./useTonConnect";
import { CHAIN } from "@tonconnect/ui-react";
import { useAsyncInitialize } from "./useAsyncInitialize";

type TonClientContextType = {
    client: TonWeb | null;
    loading: boolean;
};

const TonClientContext = createContext<TonClientContextType | undefined>(undefined);

export const TonClientProvider = ({ children }: { children: React.ReactNode }) => {
    const { network } = useTonConnect();
    const [client, setClient] = useState<TonWeb | null>(null);
    const [loading, setLoading] = useState(true);

    useAsyncInitialize(async () => {
        const endpoint = await getHttpEndpoint({
            network: network === CHAIN.TESTNET ? "testnet" : "mainnet",
        });
        const newClient = new TonWeb(new TonWeb.HttpProvider(endpoint));
        setClient(newClient);
        setLoading(false);
        return newClient;
    }, [network]);

    return <TonClientContext.Provider value={{ client, loading }}>{children}</TonClientContext.Provider>;
};

export function useTonClient() {
    const context = useContext(TonClientContext)?.client;
    if (context === undefined) {
        throw new Error("useTonClient must be used within a TonClientProvider");
    }
    return context;
}
