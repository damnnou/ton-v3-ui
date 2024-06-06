import { MessageData } from "@ston-fi/sdk";
import { CHAIN, useTonConnectModal, useTonConnectUI } from "@tonconnect/ui-react";
import { ActionButton } from "src/components/ui/ActionButton";
import { useTonConnect } from "src/hooks/common/useTonConnect";

export const SwapButton = ({ txParams }: { txParams: MessageData | undefined }) => {
    const [tonConnectUI, tonConnectOptions] = useTonConnectUI();
    const { sender, connected, network } = useTonConnect();
    const { open } = useTonConnectModal();

    if (!connected) return <ActionButton onClick={open}>Connect Wallet</ActionButton>;

    if (network === CHAIN.TESTNET) return <ActionButton disabled>Switch to Mainnet</ActionButton>;

    if (!txParams) return <ActionButton disabled>Enter amount</ActionButton>;

    const handleSwap = async () => {
        if (!tonConnectUI || !tonConnectOptions) return;

        sender.send(txParams);
    };

    return <ActionButton onClick={handleSwap}>Swap</ActionButton>;
};
