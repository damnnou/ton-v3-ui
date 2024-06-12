import { useState } from "react";
import { InputField } from "src/components/swap/AmountsSection/InputField";
import { OutputField } from "src/components/swap/AmountsSection/OutputField";
import { ActionButton } from "src/components/ui/Button";
import { Spinner } from "src/components/ui/Spinner";
import { Jetton } from "src/constants/jettons";
import { useDebounce } from "src/hooks/common/useDebounce";
import { useSendTransaction } from "src/hooks/common/useSendTransaction";
import { useProvideLiquidityTxParams } from "src/hooks/pool/useProvideLiquidityTxParams";
import { useExpectedOutputs } from "src/hooks/swap/useExpectedOutputs";

export const AddLiquidity = ({ jetton0, jetton1 }: { jetton0: Jetton; jetton1: Jetton }) => {
    const [inputValue, setInputValue] = useState<number>(0);

    const debouncedValue = useDebounce(inputValue, 300);

    const { expectedOutput, isLoading } = useExpectedOutputs(jetton0, jetton1, debouncedValue);

    const txsParams = useProvideLiquidityTxParams({
        offerJetton: jetton0,
        askJetton: jetton1,
        offerAmount: debouncedValue,
        minAskAmount: expectedOutput,
    });

    const { write, isLoading: isProviding } = useSendTransaction(txsParams);

    return (
        <div className="relative w-full max-w-[500px] rounded-2xl transition-all duration-300 bg-light delay-50 overflow-hidden shadow-2xl shadow-purple-500/10 flex flex-col sm:gap-4 gap-2 border-2 border-border-light sm:p-4 sm:rounded-3xl sm:bg-light p-2">
            <InputField
                onClick={() => null}
                onChange={setInputValue}
                selectedToken={jetton0}
                value={inputValue > 0 ? inputValue : undefined}
            />
            <OutputField onClick={() => null} selectedToken={jetton1} value={expectedOutput} />
            <ActionButton onClick={write} disabled={isLoading || isProviding || !write}>
                {isLoading || isProviding ? <Spinner className="w-12 h-12" /> : "Add liquidity"}
            </ActionButton>
        </div>
    );
};
