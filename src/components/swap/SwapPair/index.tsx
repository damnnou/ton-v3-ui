import { useCallback } from "react";
import TokenCard from "../TokenCard";
import { useDerivedSwapInfo, useSwapActionHandlers, useSwapState } from "src/state/swapStore";
import { SwapField, SwapFieldType } from "src/types/swap-field";
import { MenuState } from "src/types/token-menu";
import { SwitchButton } from "src/components/ui/Button";

const SwapPair = () => {
    const { parsedAmount, toggledTrade: trade, currencies } = useDerivedSwapInfo();

    const baseCurrency = currencies[SwapField.INPUT];
    const quoteCurrency = currencies[SwapField.OUTPUT];

    const { independentField, typedValue } = useSwapState();
    const dependentField: SwapFieldType = independentField === SwapField.INPUT ? SwapField.OUTPUT : SwapField.INPUT;

    const { onUserInput } = useSwapActionHandlers();

    const handleTypeInput = useCallback(
        (value: string) => {
            onUserInput(SwapField.INPUT, value);
        },
        [onUserInput]
    );
    const handleTypeOutput = useCallback(
        (value: string) => {
            onUserInput(SwapField.OUTPUT, value);
        },
        [onUserInput]
    );
    const parsedAmountA = independentField === SwapField.INPUT ? parsedAmount : trade?.inputAmount;

    const parsedAmountB = independentField === SwapField.OUTPUT ? parsedAmount : trade?.outputAmount;

    const parsedAmounts = {
        [SwapField.INPUT]: parsedAmountA,
        [SwapField.OUTPUT]: parsedAmountB,
    };

    console.log(trade);

    const formattedAmounts = {
        [independentField]: typedValue,
        [dependentField]: parsedAmounts[dependentField]?.toFixed(),
    };

    return (
        <div className="flex flex-col sm:gap-4 gap-2 relative">
            <TokenCard
                value={formattedAmounts[SwapField.INPUT] || ""}
                currency={baseCurrency}
                handleValueChange={handleTypeInput}
                menuType={MenuState.INPUT}
            />
            <SwitchButton onClick={() => null} className="absolute left-1/2 translate-x-[-50%] top-1/2 translate-y-[-50%]" />
            <TokenCard
                value={formattedAmounts[SwapField.OUTPUT] || ""}
                currency={quoteCurrency}
                handleValueChange={handleTypeOutput}
                menuType={MenuState.OUTPUT}
            />
        </div>
    );
};

export default SwapPair;
