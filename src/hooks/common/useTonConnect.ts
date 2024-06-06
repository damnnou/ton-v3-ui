import { CHAIN, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { MessageData } from "@ston-fi/sdk";

// @ts-expect-error - polyfill with no types
import { encode } from "uint8-to-base64";

export type Sender = {
    send: (args: MessageData) => Promise<void>;
};

export function useTonConnect(): {
    sender: Sender;
    connected: boolean;
    wallet: string | null;
    network: CHAIN | null;
} {
    const [tonConnectUI] = useTonConnectUI();
    const wallet = useTonWallet();

    return {
        sender: {
            send: async (args: MessageData) => {
                console.log("sending message: ", {
                    address: args.to.toString(),
                    amount: args.gasAmount.toString(),
                    payload: encode(await args.payload.toBoc()),
                });
                tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: args.to.toString(),
                            amount: args.gasAmount.toString(),
                            payload: encode(await args.payload.toBoc()),
                        },
                    ],
                    validUntil: Date.now() + 5 * 60 * 1000, // 5 min
                });
            },
        },
        connected: !!wallet?.account.address,
        wallet: wallet?.account.address ?? null,
        network: wallet?.account.chain ?? null,
    };
}
