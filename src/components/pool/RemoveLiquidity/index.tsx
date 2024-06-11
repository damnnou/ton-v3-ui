import { useState } from "react";
import { ActionButton, Button } from "src/components/ui/Button";
import { Input } from "src/components/ui/Input";
import { Spinner } from "src/components/ui/Spinner";
import { Jetton } from "src/constants/jettons";
import { useSendTransaction } from "src/hooks/common/useSendTransaction";

export const RemoveLiquidity = ({ jetton0, jetton1 }: { jetton0: Jetton; jetton1: Jetton }) => {
    const [percent, setPercent] = useState<number>(0);

    const { write, isLoading: isProviding } = useSendTransaction(undefined);
    const isLoading = false;

    return (
        <div className="w-full flex flex-col gap-4 rounded-2xl bg-light border-2 border-border-light p-4 justify-between">
            <Input value={percent} onChange={(e) => setPercent(Number(e.target.value))} />
            <ul className="flex gap-4 w-full items-center justify-between">
                {[10, 25, 50, 75, 100].map((v) => (
                    <li key={v}>
                        <Button variant={"outline"} onClick={() => setPercent(v)}>
                            {v}%
                        </Button>
                    </li>
                ))}
            </ul>
            <ActionButton onClick={write} disabled={isLoading || isProviding || !write}>
                {isLoading || isProviding ? <Spinner className="w-12 h-12" /> : "Add liquidity"}
            </ActionButton>
        </div>
    );
};
