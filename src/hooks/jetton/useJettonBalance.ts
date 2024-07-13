import { useMemo } from "react";
import { useTonConsoleClient } from "../common/useTonConsoleClient";
import { Api } from "tonapi-sdk-js";
import useSWR from "swr";
import { Address } from "@ton/core";

async function fetchBalances(client: Api<unknown>, wallet: string | null) {
    if (!client || !wallet) throw new Error("Can't fetch balances without ton client or wallet");

    return client.accounts.getAccountJettonsBalances(Address.parse(wallet).toString());
}

export function useJettonBalance(jettonAddress: string | undefined, wallet: string | null) {
    const balances = useAccountBalances(wallet);

    return useMemo(() => {
        if (!wallet) return "";
        if (!jettonAddress || !balances) return;

        const jettonBalance = balances.filter((jb) => Address.parse(jb.jetton.address).equals(Address.parse(jettonAddress)));

        if (jettonBalance.length === 0) return "";

        return jettonBalance[0].balance;
    }, [balances, jettonAddress, wallet]);
}

function useAccountBalances(wallet: string | null) {
    const client = useTonConsoleClient();

    const { data: balances } = useSWR(["accountBalances", wallet], () => fetchBalances(client, wallet), {
        revalidateOnFocus: false,
        revalidateOnMount: false,
        refreshInterval: 10000,
    });

    return balances?.balances;
}
