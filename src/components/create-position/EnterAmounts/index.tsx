import { useEffect } from "react";
import { Field, Jetton } from "src/sdk/src";
import { IDerivedMintInfo, useMintActionHandlers, useMintState } from "src/state/mintStore";
import EnterAmountCard from "../EnterAmountsCard";
import EnterAmountsCard from "../EnterAmountsCard";

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
        <div className="flex flex-col md:flex-row lg:flex-col gap-2">
            <div className="flex w-full relative">
                <EnterAmountsCard
                    currency={currencyA}
                    value={formattedAmounts[Field.CURRENCY_A]}
                    handleChange={(value) => onFieldAInput(value)}
                    // needApprove={allowanceA}
                />
                {mintInfo.depositADisabled && (
                    <div className="absolute left-0 top-0 flex items-center justify-center w-full h-full bg-card-dark/70 rounded-3xl">
                        For selected range this deposit is disabled
                    </div>
                )}
            </div>
            <div className="flex w-full relative">
                <EnterAmountCard
                    currency={currencyB}
                    value={formattedAmounts[Field.CURRENCY_B]}
                    handleChange={(value) => onFieldBInput(value)}
                />
                {mintInfo.depositBDisabled && (
                    <div className="absolute left-0 top-0 flex items-center justify-center w-full h-full bg-card-dark/70 rounded-3xl">
                        For selected range this deposit is disabled
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnterAmounts;
