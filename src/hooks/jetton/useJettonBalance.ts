import { useEffect, useState } from "react";
import { useTonConsoleClient } from "../common/useTonConsoleClient";

export function useJettonBalance(jettonAddress: string | undefined, wallet: string | null) {
    const [jettonBalance, setJettonBalance] = useState<string>();
    const client = useTonConsoleClient();

    useEffect(() => {
        if (!jettonAddress || !client || !wallet) return;

        client.accounts.getAccountJettonBalance(wallet, jettonAddress).then((jb) => setJettonBalance(jb.balance));
    }, [jettonAddress, client, wallet]);

    if (!wallet) return "";

    return jettonBalance;
}
