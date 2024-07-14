import { CHAIN, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { SenderArguments } from "@ton/core";

export type Sender = {
    send: (args: SenderArguments) => Promise<void>;
    sendMiltiple: (args: SenderArguments[]) => Promise<void>;
};

export function useTonConnect(): {
    sender: Sender;
    connected: boolean;
    wallet: string | null;
    network: CHAIN | undefined;
} {
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();

    return {
        sender: {
            send: async (args: SenderArguments) => {
                tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: args.to.toString(),
                            amount: args.value.toString(),
                            payload: args.body?.toBoc().toString("base64"),
                        },
                    ],
                    validUntil: Date.now() + 5 * 60 * 1000,
                });
            },
            sendMiltiple: async (args: SenderArguments[]) => {
                tonConnectUI.sendTransaction({
                    messages: args.map((arg) => ({
                        address: arg.to.toString(),
                        amount: arg.value.toString(),
                        payload: arg.body?.toBoc().toString("base64"),
                    })),
                    validUntil: Date.now() + 5 * 60 * 1000,
                });
            },
        },
        connected: !!wallet?.account.address,
        wallet: wallet?.account.address ?? null,
        network: wallet?.account.chain,
    };
}
