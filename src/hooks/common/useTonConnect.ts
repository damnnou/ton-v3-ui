import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { MessageData } from "@ston-fi/sdk";
import bytesToBase64 from "src/utils/common/bytesToBase64";

export type Sender = {
    send: (args: MessageData[]) => Promise<string>;
};

export function useTonConnect(): {
    sender: Sender;
    connected: boolean;
    wallet: string | null;
} {
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();

    return {
        sender: {
            send: async (messagesData: MessageData[]) => {
                const messages = await Promise.all(
                    messagesData.map(async (args) => ({
                        address: args.to.toString(),
                        amount: args.gasAmount.toString(),
                        payload: bytesToBase64(await args.payload.toBoc()),
                    }))
                );
                console.log("sending messages: ", messages);
                const tx = await tonConnectUI.sendTransaction({
                    messages,
                    validUntil: Date.now() + 5 * 60 * 1000, // 5 min
                });

                return tx.boc;
            },
        },
        connected: !!wallet?.account.address,
        wallet: wallet?.account.address ?? null,
    };
}
