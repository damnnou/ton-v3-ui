import { CHAIN, useTonConnectModal } from "@tonconnect/ui-react";
import { ButtonHTMLAttributes } from "react";
import { ActionButton } from "src/components/ui/Button";
import { Spinner } from "src/components/ui/Spinner";
import { useTonConnect } from "src/hooks/common/useTonConnect";
import { usePoolV3 } from "src/hooks/pool/usePoolV3";
import { useSwapCallback } from "src/hooks/swap/useSwapCallback";
import { useDerivedSwapInfo, useSwapState } from "src/state/swapStore";
import { SwapField } from "src/types/swap-field";

interface SwapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const SwapButton = ({ ...props }: SwapButtonProps) => {
    const { connected, network } = useTonConnect();
    const { open } = useTonConnectModal();

    const { independentField } = useSwapState();
    const { inputError: swapInputError, toggledTrade: trade, parsedAmount, poolAddress } = useDerivedSwapInfo();

    const amountIn = independentField === SwapField.INPUT ? parsedAmount : trade?.inputAmount;

    const amountOut = independentField === SwapField.OUTPUT ? parsedAmount : trade?.outputAmount;

    const [, pool] = usePoolV3(poolAddress);

    const { callback: swapCallback, error: swapCallbackError } = useSwapCallback({
        amountIn: amountIn?.toFixed(),
        amountOut: amountOut?.toFixed(),
        pool,
    });

    const isValid = !swapInputError;

    const isWrongChain = network !== CHAIN.TESTNET;

    if (!pool)
        return (
            <ActionButton disabled>
                <Spinner />
            </ActionButton>
        );

    if (!connected) return <ActionButton onClick={open}>Connect wallet</ActionButton>;

    if (isWrongChain) return <ActionButton disabled>Wrong network</ActionButton>;

    if (!connected)
        return (
            <ActionButton disabled={props.disabled} onClick={open}>
                {props.disabled ? <Spinner className="w-12 h-12" /> : "Connect wallet"}
            </ActionButton>
        );

    return (
        <ActionButton onClick={swapCallback} disabled={!swapCallback || !isValid || !!swapCallbackError}>
            {swapInputError ? swapInputError : "Swap"}
        </ActionButton>
    );
};
