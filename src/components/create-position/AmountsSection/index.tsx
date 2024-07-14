import { useParams } from "react-router-dom";
import { Field, Jetton } from "src/sdk/src";
import { IDerivedMintInfo, useMintState } from "src/state/mintStore";
import { ManageLiquidity } from "src/types/manage-liquidity";
import EnterAmounts from "../EnterAmounts";
import { ActionButton } from "src/components/ui/Button";
import { useCreatePositionCallback } from "src/hooks/position/useCreatePositionCallback";

interface AmountsSectionProps {
    tokenId?: number;
    currencyA: Jetton | undefined;
    currencyB: Jetton | undefined;
    mintInfo: IDerivedMintInfo;
    manageLiquidity: ManageLiquidity;
    handleCloseModal?: () => void;
}

const AmountsSection = ({ tokenId, currencyA, currencyB, mintInfo, manageLiquidity, handleCloseModal }: AmountsSectionProps) => {
    const { poolId } = useParams();
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

    // const [poolAPR, setPoolAPR] = useState<number>();
    // const apr = usePositionAPR(poolAddress, mintInfo.position);

    // useEffect(() => {
    //     if (!poolAddress) return;
    //     getPoolAPR(poolAddress).then(setPoolAPR);
    // }, [poolAddress]);

    return (
        <>
            <EnterAmounts currencyA={currencyA} currencyB={currencyB} mintInfo={mintInfo} />
            {/* <HoverCard>
                <HoverCardTrigger>
                    <TokenRatio mintInfo={mintInfo} />
                </HoverCardTrigger>
                <HoverCardContent className="flex flex-col gap-2 bg-card rounded-3xl border border-card-border text-white w-fit">
                    <div className="flex items-center">
                        <span className="font-bold">Token Ratio</span>
                    </div>
                </HoverCardContent>
            </HoverCard> */}
            <div className="flex items-center">
                <span className="font-bold">Token Ratio</span>
            </div>
            <div className="flex justify-between bg-card-dark p-2 px-3 rounded-xl">
                <div>
                    <div className="text-xs font-bold">ESTIMATED POSITION APR</div>
                    {/* <div className="text-lg font-bold text-green-300">{apr ? `${apr.toFixed(2)}%` : 0}</div> */}
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold">POOL APR</div>
                    {/* <div className="text-lg font-bold text-cyan-300">{poolAPR !== undefined ? `${poolAPR}%` : null}</div> */}
                </div>
            </div>
            <ActionButton onClick={callback}>Create Position</ActionButton>
            {/* {manageLiquidity === ManageLiquidity.INCREASE && (
                <IncreaseLiquidityButton
                    tokenId={tokenId}
                    baseCurrency={currencyA}
                    quoteCurrency={currencyB}
                    mintInfo={mintInfo}
                    handleCloseModal={handleCloseModal}
                />
            )}
            {manageLiquidity === ManageLiquidity.ADD && (
                <AddLiquidityButton baseCurrency={currencyA} quoteCurrency={currencyB} mintInfo={mintInfo} poolAddress={poolAddress} />
            )} */}
        </>
    );
};

export default AmountsSection;
