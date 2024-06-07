import { MessageData } from "@ston-fi/sdk";
import { CHAIN, useTonConnectModal } from "@tonconnect/ui-react";
import { ActionButton } from "src/components/ui/ActionButton";
import { Spinner } from "src/components/ui/Spinner";
import { useSendTransaction } from "src/hooks/common/useSendTransaction";
import { useTonConnect } from "src/hooks/common/useTonConnect";

export const SwapButton = ({ txParams }: { txParams: MessageData | undefined }) => {
    const { connected, network } = useTonConnect();
    const { open } = useTonConnectModal();

    const { write, isLoading, isPending } = useSendTransaction(txParams);

    if (!connected) return <ActionButton onClick={open}>Connect Wallet</ActionButton>;

    if (network === CHAIN.TESTNET) return <ActionButton disabled>Switch to Mainnet</ActionButton>;

    if (!txParams) return <ActionButton disabled>Enter amount</ActionButton>;

    return (
        <ActionButton disabled={isPending || isLoading} onClick={write}>
            {isPending ? "Sending..." : isLoading ? <Spinner width={12} /> : "Swap"}
        </ActionButton>
    );
};
