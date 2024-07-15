import { useEffect } from "react";
import { Field, Jetton } from "src/sdk/src";
import { IDerivedMintInfo, useMintActionHandlers, useMintState } from "src/state/mintStore";
import TokenCard from "src/components/swap/TokenCard";
import { MenuState } from "src/types/token-menu";

interface EnterAmountsProps {
    currencyA: Jetton | undefined;
    currencyB: Jetton | undefined;
    mintInfo: IDerivedMintInfo;
}

const EnterAmounts = ({ currencyA, currencyB, mintInfo }: EnterAmountsProps) => {
    const { independentField, typedValue } = useMintState();

    const { onFieldAInput, onFieldBInput } = useMintActionHandlers(mintInfo.noLiquidity);

    const formattedAmounts = {
        [independentField]: typedValue,
        [mintInfo.dependentField]: mintInfo.parsedAmounts[mintInfo.dependentField]?.toSignificant(6) ?? "",
    };

    useEffect(() => {
        return () => {
            onFieldAInput("");
            onFieldBInput("");
        };
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex w-full relative">
                <TokenCard
                    currency={currencyA}
                    handleValueChange={onFieldAInput}
                    value={formattedAmounts[Field.CURRENCY_A]}
                    menuType={MenuState.CLOSED}
                />
                {mintInfo.depositADisabled && (
                    <div className="flex flex-col absolute font-bold text-lg left-0 top-0 items-center justify-center w-full h-full bg-dark/90 rounded-2xl">
                        <span>For selected range</span>
                        <span>this deposit is disabled</span>
                    </div>
                )}
            </div>
            <div className="flex w-full relative">
                <TokenCard
                    currency={currencyB}
                    handleValueChange={onFieldBInput}
                    value={formattedAmounts[Field.CURRENCY_B]}
                    menuType={MenuState.CLOSED}
                />
                {mintInfo.depositBDisabled && (
                    <div className="flex flex-col absolute font-bold text-lg left-0 top-0 items-center justify-center w-full h-full bg-dark/90 rounded-2xl">
                        <span>For selected range</span>
                        <span>this deposit is disabled</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnterAmounts;
