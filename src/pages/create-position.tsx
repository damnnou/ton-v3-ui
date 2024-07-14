import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import AmountsSection from "src/components/create-position/AmountsSection";
import PresetTabs from "src/components/create-position/PresetTabs";
import RangeSelector from "src/components/create-position/RangeSelector";
import { usePoolV3 } from "src/hooks/pool/usePoolV3";
import { Bound, INITIAL_POOL_FEE } from "src/sdk/src";
import { useDerivedMintInfo, useMintActionHandlers, useMintState, useRangeHopCallbacks } from "src/state/mintStore";
import { ManageLiquidity } from "src/types/manage-liquidity";

const CreatePositionPage = () => {
    const { poolId } = useParams();

    const [, pool] = usePoolV3(poolId);

    const mintInfo = useDerivedMintInfo(
        pool?.jetton0 ?? undefined,
        pool?.jetton1 ?? undefined,
        poolId,
        INITIAL_POOL_FEE,
        pool?.jetton0 ?? undefined,
        undefined
    );

    const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = mintInfo.pricesAtTicks;

    const price = useMemo(() => {
        if (!mintInfo.price) return;

        return mintInfo.invertPrice ? mintInfo.price.invert().toSignificant(5) : mintInfo.price.toSignificant(5);
    }, [mintInfo]);

    const currentPrice = useMemo(() => {
        if (!mintInfo.price) return;

        if (Number(price) <= 0.0001) {
            return `< 0.0001 ${pool?.jetton1?.symbol}`;
        } else {
            return `${price} ${pool?.jetton1?.symbol}`;
        }
    }, [mintInfo.price, pool?.jetton1?.symbol, price]);

    const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = useMemo(() => {
        return mintInfo.ticks;
    }, [mintInfo]);

    const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper } = useRangeHopCallbacks(
        pool?.jetton0 ?? undefined,
        pool?.jetton1 ?? undefined,
        mintInfo.tickSpacing,
        tickLower,
        tickUpper,
        mintInfo.pool
    );

    const { onLeftRangeInput, onRightRangeInput } = useMintActionHandlers(mintInfo.noLiquidity);

    const { startPriceTypedValue } = useMintState();

    useEffect(() => {
        return () => {
            onLeftRangeInput("");
            onRightRangeInput("");
        };
    }, []);

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-0 gap-y-8 w-full lg:gap-8 mt-8 lg:mt-16 text-left">
                <div className="col-span-2">
                    <div className="flex max-md:flex-col md:items-center justify-between w-full mb-6 gap-4">
                        <h2 className="font-semibold text-2xl text-left">1. Select Range</h2>
                        <PresetTabs currencyA={pool?.jetton0} currencyB={pool?.jetton1} mintInfo={mintInfo} />
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="w-full px-8 py-6 bg-card text-left rounded-3xl border border-card-border">
                            <div className="flex w-full flex-col md:flex-row gap-4">
                                <RangeSelector
                                    priceLower={priceLower}
                                    priceUpper={priceUpper}
                                    getDecrementLower={getDecrementLower}
                                    getIncrementLower={getIncrementLower}
                                    getDecrementUpper={getDecrementUpper}
                                    getIncrementUpper={getIncrementUpper}
                                    onLeftRangeInput={onLeftRangeInput}
                                    onRightRangeInput={onRightRangeInput}
                                    currencyA={pool?.jetton0}
                                    currencyB={pool?.jetton1}
                                    mintInfo={mintInfo}
                                    disabled={!startPriceTypedValue && !mintInfo.price}
                                />
                                <div className="md:ml-auto md:text-right">
                                    <div className="font-bold text-xs mb-3">CURRENT PRICE</div>
                                    <div className="font-bold text-xl">{`${currentPrice}`}</div>
                                </div>
                            </div>

                            {/* <LiquidityChart
                                currencyA={currencyA}
                                currencyB={currencyB}
                                currentPrice={price ? parseFloat(price) : undefined}
                                priceLower={priceLower}
                                priceUpper={priceUpper}
                            /> */}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col">
                    <h2 className="font-semibold text-2xl text-left mb-6 leading-[44px]">2. Enter Amounts</h2>
                    <div className="flex flex-col w-full h-full gap-2 bg-card border border-card-border rounded-3xl p-2">
                        <AmountsSection
                            currencyA={pool?.jetton0}
                            currencyB={pool?.jetton1}
                            mintInfo={mintInfo}
                            manageLiquidity={ManageLiquidity.ADD}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePositionPage;
