import { useState } from "react";
import { InputField } from "src/components/swap/AmountsSection/InputField";
import { OutputField } from "src/components/swap/AmountsSection/OutputField";
import { ActionButton } from "src/components/ui/Button";
import { Spinner } from "src/components/ui/Spinner";
import { useDebounce } from "src/hooks/common/useDebounce";
import { useSendTransaction } from "src/hooks/common/useSendTransaction";
import { Pool } from "src/hooks/pool/usePool";
import { useProvideLiquidityTxParams } from "src/hooks/pool/useProvideLiquidityTxParams";
import { useUserReserves } from "src/hooks/pool/useUserReserves";
import { formatUnits } from "src/utils/common/formatUnits";

export const AddLiquidity = ({ pool }: { pool: Pool }) => {
    const [inputValue, setInputValue] = useState<number>(0);

    const reserve0 = formatUnits(pool.reserve0, pool.token0.decimals);
    const reserve1 = formatUnits(pool.reserve1, pool.token1.decimals);
    const token0Rate = reserve1 / reserve0;

    const [userReserve0, userReserve1] = useUserReserves(pool);
    const initializedToken0Rate = userReserve0 && userReserve1 && userReserve1 / userReserve0;

    const debouncedValue = useDebounce(inputValue, 300);

    const txsParams = useProvideLiquidityTxParams({
        offerJetton: pool.token0,
        askJetton: pool.token1,
        offerAmount: debouncedValue,
        minAskAmount: initializedToken0Rate ? debouncedValue * initializedToken0Rate : debouncedValue * token0Rate,
    });

    const { write, isLoading: isProviding } = useSendTransaction(txsParams);

    return (
        <div className="relative w-full max-w-[500px] rounded-3xl transition-all duration-300 bg-light delay-50 overflow-hidden shadow-2xl shadow-purple-500/10 flex flex-col sm:gap-4 gap-2 border-2 border-border-light sm:p-4 sm:bg-light p-2">
            <InputField
                onClick={() => null}
                onChange={setInputValue}
                selectedToken={pool.token0}
                value={inputValue > 0 ? inputValue : undefined}
            />
            <OutputField
                onClick={() => null}
                selectedToken={pool.token1}
                value={initializedToken0Rate ? debouncedValue * initializedToken0Rate : debouncedValue * token0Rate}
            />
            <ActionButton onClick={write} disabled={isProviding || !write}>
                {isProviding ? <Spinner className="w-12 h-12" /> : "Add liquidity"}
            </ActionButton>
        </div>
    );
};
