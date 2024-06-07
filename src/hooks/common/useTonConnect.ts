import { CHAIN, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { MessageData } from "@ston-fi/sdk";
import bytesToBase64 from "src/utils/bytesToBase64";

export type Sender = {
    send: (args: MessageData) => Promise<string>;
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
                    payload: bytesToBase64(await args.payload.toBoc()),
                });
                const tx = await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: args.to.toString(),
                            amount: args.gasAmount.toString(),
                            payload: bytesToBase64(await args.payload.toBoc()),
                        },
                    ],
                    validUntil: Date.now() + 5 * 60 * 1000, // 5 min
                });

                return tx.boc;
            },
        },
        connected: !!wallet?.account.address,
        wallet: wallet?.account.address ?? null,
        network: wallet?.account.chain ?? null,
    };
}
