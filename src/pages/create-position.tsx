import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import AmountsSection from "src/components/create-position/AmountsSection";
import PresetTabs from "src/components/create-position/PresetTabs";
import PriceSlider from "src/components/create-position/PriceSlider/PriceSlider";
import RangeSelector from "src/components/create-position/RangeSelector";
import { usePoolV3 } from "src/hooks/pool/usePoolV3";
import { Bound, INITIAL_POOL_FEE } from "src/sdk/src";
import { useDerivedMintInfo, useMintActionHandlers, useMintState, useRangeHopCallbacks } from "src/state/mintStore";

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
            return `< 0.0001 ${pool?.jetton1?.symbol} per ${pool?.jetton0?.symbol}`;
        } else {
            return `${price} ${pool?.jetton1?.symbol} per ${pool?.jetton0?.symbol}`;
        }
    }, [mintInfo.price, pool?.jetton0?.symbol, pool?.jetton1?.symbol, price]);

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
        <div className="flex w-full gap-8 my-12">
            <div className="flex flex-col w-full">
                <h2 className="font-semibold text-2xl text-left mb-6">1. Select Range</h2>
                <div className="flex flex-col gap-4 w-full p-8 bg-light text-left rounded-3xl border border-border-light">
                    <h3 className="text-xl">Choose liquidity preset</h3>
                    <PresetTabs currencyA={pool?.jetton0} currencyB={pool?.jetton1} mintInfo={mintInfo} />
                    <h3 className="text-xl mt-4">Price</h3>
                    <PriceSlider
                        currentPrice={currentPrice}
                        priceLower={priceLower}
                        priceUpper={priceUpper}
                        onLeftRangeInput={onLeftRangeInput}
                        onRightRangeInput={onRightRangeInput}
                        mintInfo={mintInfo}
                    />

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
                    </div>
                </div>
            </div>

            <div>
                <h2 className="font-semibold text-2xl mb-6 text-left">2. Enter Amounts</h2>
                <AmountsSection currencyA={pool?.jetton0} currencyB={pool?.jetton1} mintInfo={mintInfo} />
            </div>
        </div>
    );
};

export default CreatePositionPage;
