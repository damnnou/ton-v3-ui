import { Field, Jetton } from "src/sdk/src";
import { IDerivedMintInfo, useMintState } from "src/state/mintStore";
import EnterAmounts from "../EnterAmounts";
import { ActionButton } from "src/components/ui/Button";
import { useCreatePositionCallback } from "src/hooks/position/useCreatePositionCallback";
import TokenRatio from "../TokenRatio";

interface AmountsSectionProps {
    currencyA: Jetton | undefined;
    currencyB: Jetton | undefined;
    mintInfo: IDerivedMintInfo;
}

const AmountsSection = ({ currencyA, currencyB, mintInfo }: AmountsSectionProps) => {
    const { independentField, typedValue } = useMintState();

    const formattedAmounts = {
        [independentField]: typedValue,
        [mintInfo.dependentField]: mintInfo.parsedAmounts[mintInfo.dependentField]?.toExact(),
    };

    const { callback } = useCreatePositionCallback({
        mintInfo,
        jetton0Amount: formattedAmounts[Field.CURRENCY_A],
        jetton1Amount: formattedAmounts[Field.CURRENCY_B],
    });

    return (
        <div className="flex flex-col w-[500px] h-fit gap-4 bg-light border-0 border-border-light rounded-3xl p-4">
            <EnterAmounts currencyA={currencyA} currencyB={currencyB} mintInfo={mintInfo} />
            <TokenRatio mintInfo={mintInfo} />
            <ActionButton onClick={callback}>Create Position</ActionButton>
        </div>
    );
};

export default AmountsSection;
