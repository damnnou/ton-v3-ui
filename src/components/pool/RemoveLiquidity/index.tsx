import { useState } from "react";
import { ActionButton, Button } from "src/components/ui/Button";
import { Spinner } from "src/components/ui/Spinner";
import { Jetton } from "src/constants/jettons";
import { useSendTransaction } from "src/hooks/common/useSendTransaction";
import { useBurnLiquidityTxParams } from "src/hooks/pool/useBurnLiquidityTxParams";
import { Position } from "src/hooks/position/usePosition";
import { formatUnits } from "src/utils/common/formatUnits";

export const RemoveLiquidity = ({ jetton0, jetton1, position }: { jetton0: Jetton; jetton1: Jetton; position: Position }) => {
    const [percent, setPercent] = useState<number>(0);

    const txsParams = useBurnLiquidityTxParams({
        position,
        percent,
    });

    const { write, isLoading } = useSendTransaction(txsParams);

    return (
        <div className="relative w-full max-w-[500px] rounded-2xl transition-all duration-300 bg-light delay-50 overflow-hidden shadow-2xl shadow-purple-500/10 flex flex-col sm:gap-4 gap-4 border-2 border-border-light sm:p-4 sm:rounded-3xl sm:bg-light p-2">
            <input
                className="w-full h-20 border-2 border-border-light rounded-2xl bg-dark outline-none px-6 text-2xl"
                placeholder="0.00"
                value={percent ? percent : ""}
                onChange={(e) => setPercent(Number(e.target.value))}
                type="number"
                min={0}
                max={100}
            />
            <ul className="flex gap-4 w-full items-center justify-between">
                {[10, 25, 50, 100].map((v) => (
                    <li key={v}>
                        <Button variant={v === percent ? "iconActive" : "icon"} onClick={() => setPercent(v)}>
                            {v}%
                        </Button>
                    </li>
                ))}
            </ul>
            <div className="flex flex-col gap-4 px-2">
                <div className="flex justify-between">
                    <div>{`${jetton0.symbol} provided`}</div>
                    <div>{formatUnits(position.amount0, jetton0.decimals)}</div>
                </div>
                <div className="flex justify-between">
                    <div>{`${jetton1.symbol} provided`}</div>
                    <div>{formatUnits(position.amount1, jetton1.decimals)}</div>
                </div>
                <div className="flex justify-between">
                    <div>{`LP tokens amount`}</div>
                    <div>{formatUnits(position.lpAmount, 9)}</div>
                </div>
            </div>
            <ActionButton
                className="bg-primary-red hover:bg-primary-red/60 disabled:hover:bg-primary-red/80 disabled:bg-primary-red/80 disabled:cursor-not-allowed"
                onClick={write}
                disabled={isLoading || !write}
            >
                {isLoading ? <Spinner className="w-12 h-12" /> : "Remove liquidity"}
            </ActionButton>
        </div>
    );
};
