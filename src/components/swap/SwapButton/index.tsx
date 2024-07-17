import { CHAIN, useTonConnectModal } from "@tonconnect/ui-react";
import { ActionButton } from "src/components/ui/Button";
import { Spinner } from "src/components/ui/Spinner";
import { useTonConnect } from "src/hooks/common/useTonConnect";
import { useSwapCallback } from "src/hooks/swap/useSwapCallback";
import { useDerivedSwapInfo, useSwapState } from "src/state/swapStore";
import { SwapField } from "src/types/swap-field";
import { TradeState } from "src/types/trade-state";

export const SwapButton = () => {
    const { connected, network } = useTonConnect();
    const { open } = useTonConnectModal();

    const { independentField } = useSwapState();
    const { inputError: swapInputError, toggledTrade: trade, parsedAmount, pool, tradeState } = useDerivedSwapInfo();

    const amountIn = independentField === SwapField.INPUT ? parsedAmount : trade?.inputAmount;

    const amountOut = independentField === SwapField.OUTPUT ? parsedAmount : trade?.outputAmount;

    const { callback: swapCallback, error: swapCallbackError } = useSwapCallback({
        amountIn: amountIn?.toFixed(),
        amountOut: amountOut?.toFixed(),
        pool,
    });

    const isValid = !swapInputError;

    const isWrongChain = network !== CHAIN.TESTNET;

    // if (!isValid) return <ActionButton disabled>{swapInputError}</ActionButton>;

    if (!pool || tradeState.state === TradeState.LOADING)
        return (
            <ActionButton disabled>
                <Spinner />
            </ActionButton>
        );

    if (!connected) return <ActionButton onClick={open}>Connect wallet</ActionButton>;

    if (isWrongChain) return <ActionButton disabled>Wrong network</ActionButton>;

    if (!connected) return <ActionButton onClick={open}>Connect wallet</ActionButton>;

    return (
        <ActionButton onClick={swapCallback} disabled={!swapCallback || !isValid || !!swapCallbackError}>
            {swapInputError ? swapInputError : "Swap"}
        </ActionButton>
    );
};
