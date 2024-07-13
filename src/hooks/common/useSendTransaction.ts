import { useTonConnect } from "./useTonConnect";
import { useEffect, useState } from "react";
import { Address, SenderArguments } from "@ton/core";
import { useTonClient } from "./useTonClient.tsx";

export function useSendTransaction(txParams: SenderArguments | undefined) {
    const client = useTonClient();
    const { sender, wallet } = useTonConnect();

    const [isPending, setIsPending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [txBoc, setTxBoc] = useState<string>();

    useEffect(() => {
        if (!txBoc || !client || !wallet) return;
        setIsLoading(true);

        const waitForTransaction = async () => {
            const lastTx = (await client.getTransactions(Address.parse(wallet), { limit: 1 }))[0];
            const lastTxHash = lastTx.hash;

            const waitForTx = setInterval(async () => {
                const tx = (await client.getTransactions(Address.parse(wallet), { limit: 1 }))[0];
                const txHash = tx.hash;

                if (lastTxHash !== txHash) {
                    setIsLoading(false);
                    setTxBoc(undefined);
                    clearInterval(waitForTx);
                }
            }, 5000);
        };

        waitForTransaction();
    }, [txBoc, client, wallet]);

    if (!sender || !txParams || !client || !wallet) return {};

    const write = async () => {
        setIsPending(true);

        try {
            const boc = await sender.send(txParams);
            setTxBoc(boc);
        } catch (e) {
            console.log(e);
        }

        setIsPending(false);
    };

    return {
        write,
        isPending,
        isLoading,
    };
}
