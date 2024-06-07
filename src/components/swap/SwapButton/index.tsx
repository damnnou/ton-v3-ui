import { MessageData } from "@ston-fi/sdk";
import { CHAIN, useTonConnectModal } from "@tonconnect/ui-react";
import { ButtonHTMLAttributes } from "react";
import { ActionButton } from "src/components/ui/ActionButton";
import { Spinner } from "src/components/ui/Spinner";
import { useSendTransaction } from "src/hooks/common/useSendTransaction";
import { useTonConnect } from "src/hooks/common/useTonConnect";

interface SwapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    txParams: MessageData | undefined;
}

export const SwapButton = ({ txParams, ...props }: SwapButtonProps) => {
    const { connected, network } = useTonConnect();
    const { open } = useTonConnectModal();

    const { write, isLoading, isPending } = useSendTransaction(txParams);

    if (!connected)
        return (
            <ActionButton disabled={props.disabled} onClick={open}>
                {props.disabled ? <Spinner className="w-12 h-12" /> : "Connect wallet"}
            </ActionButton>
        );

    if (network === CHAIN.TESTNET)
        return <ActionButton disabled>{props.disabled ? <Spinner className="w-12 h-12" /> : "Switch to mainnet"}</ActionButton>;

    if (!txParams) return <ActionButton disabled>{props.disabled ? <Spinner className="w-12 h-12" /> : "Enter an amount"}</ActionButton>;

    return (
        <ActionButton {...props} disabled={isPending || isLoading || props.disabled} onClick={write}>
            {isPending ? "Sending..." : isLoading || props.disabled ? <Spinner className="w-12 h-12" /> : "Swap"}
        </ActionButton>
    );
};
