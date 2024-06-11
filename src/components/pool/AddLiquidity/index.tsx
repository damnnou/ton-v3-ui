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
        <div className="w-full flex flex-col gap-4 p-4 bg-light rounded-2xl border-2 border-border-light">
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
