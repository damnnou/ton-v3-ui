import { useMemo } from "react";
import ReactSlider from "react-slider";
import { Jetton, Price } from "src/sdk/src";
import { IDerivedMintInfo } from "src/state/mintStore";

export interface PriceSliderProps {
    priceLower: Price<Jetton, Jetton> | undefined;
    priceUpper: Price<Jetton, Jetton> | undefined;
    onLeftRangeInput: (typedValue: string) => void;
    onRightRangeInput: (typedValue: string) => void;
    mintInfo: IDerivedMintInfo;
    currentPrice: string | undefined;
}

const PriceSlider = ({ priceLower, priceUpper, onLeftRangeInput, onRightRangeInput, mintInfo, currentPrice }: PriceSliderProps) => {
    const isSorted = true;

    const leftPrice = useMemo(() => {
        return isSorted ? priceLower : priceUpper?.invert();
    }, [isSorted, priceLower, priceUpper]);

    const rightPrice = useMemo(() => {
        return isSorted ? priceUpper : priceLower?.invert();
    }, [isSorted, priceUpper, priceLower]);

    const values = [Number(leftPrice?.toFixed()), Number(rightPrice?.toFixed())];

    const priceNum = Number(mintInfo.price?.toFixed(4));

    const setValues = (values: number[]) => {
        onLeftRangeInput(values[0].toString());
        onRightRangeInput(values[1].toString());
    };

    return (
        <div className="relative w-full h-fit mt-6 mb-10">
            <ReactSlider
                className="relative w-full h-4"
                thumbClassName="flex items-center relative justify-center w-8 h-8 bg-primary-green text-white rounded-full cursor-grab border-4 border-white"
                trackClassName="absolute top-1/2 h-4 bg-border-light rounded-xl"
                value={values}
                onChange={(val) => setValues(val)}
                min={priceNum * 0.01}
                max={priceNum * 2}
                step={0.01}
                pearling
                minDistance={0.01}
                renderThumb={(props, state) => (
                    <div {...props}>
                        <div></div>
                        <div className="absolute top-8">{state.valueNow}</div>
                    </div>
                )}
            />
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-primary-green">|</div>
            <div className="absolute w-fit text-xs bg-border-light p-2 rounded-xl text-primary-green -top-10 left-1/2 transform -translate-x-1/2">
                Current price: {currentPrice}
            </div>
        </div>
    );
};

export default PriceSlider;
