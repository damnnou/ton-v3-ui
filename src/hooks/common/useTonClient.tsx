import React, { createContext, useContext, useState } from "react";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { TonClient } from "@ton/ton";

type TonClientContextType = {
    client: TonClient | null;
    loading: boolean;
};

const TonClientContext = createContext<TonClientContextType | undefined>(undefined);

export const TonClientProvider = ({ children }: { children: React.ReactNode }) => {
    const [client, setClient] = useState<TonClient | null>(null);
    const [loading, setLoading] = useState(true);

    useAsyncInitialize(async () => {
        const endpoint = await getHttpEndpoint({
            network: "testnet",
        });
        const newClient = new TonClient({ endpoint });
        setClient(newClient);
        setLoading(false);
        return newClient;
    }, []);

    return <TonClientContext.Provider value={{ client, loading }}>{children}</TonClientContext.Provider>;
};

export function useTonClient() {
    const context = useContext(TonClientContext)?.client;
    if (context === undefined) {
        throw new Error("useTonClient must be used within a TonClientProvider");
    }
    return context;
}
