import { MessageData } from "@ston-fi/sdk";
import { useTonConnect } from "./useTonConnect";
import { useEffect, useState } from "react";
import { useTonClient } from "./useTonClient";

export function useSendTransaction(txParams: MessageData | undefined) {
    const client = useTonClient();
    const { sender, wallet } = useTonConnect();

    const [isPending, setIsPending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [txBoc, setTxBoc] = useState<string>();

    useEffect(() => {
        if (!txBoc || !client || !wallet) return;
        setIsLoading(true);

        const waitForTransaction = async () => {
            const lastTx = (await client.getTransactions(wallet, 1))[0];
            const lastTxHash = lastTx.transaction_id.hash;

            const waitForTx = setInterval(async () => {
                const tx = (await client.getTransactions(wallet, 1))[0];
                const txHash = tx.transaction_id.hash;

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
