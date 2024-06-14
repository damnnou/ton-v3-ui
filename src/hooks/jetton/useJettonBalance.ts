import { AddressType } from "@ston-fi/sdk";
import { useEffect, useState } from "react";
import { useTonConsoleClient } from "../common/useTonConsoleClient";
import { useTonConnect } from "../common/useTonConnect";
import { isTON } from "src/utils/common/isTON";
import { CHAIN } from "@tonconnect/ui-react";

export function useJettonBalance(jettonAddress: AddressType | undefined) {
    const [jettonBalance, setJettonBalance] = useState<string>();
    const client = useTonConsoleClient();
    const { wallet } = useTonConnect();

    const { network } = useTonConnect();

    useEffect(() => {
        if (!jettonAddress || !client || !wallet) return;

        if (isTON(jettonAddress, network || CHAIN.MAINNET)) {
            client.accounts.getAccount(wallet).then((account) => setJettonBalance(account.balance.toString()));
            return;
        }

        client.accounts.getAccountJettonBalance(wallet, jettonAddress.toString(false)).then((jb) => setJettonBalance(jb.balance));
    }, [jettonAddress, client, wallet, network]);

    if (!wallet) return "";

    return jettonBalance;
}
