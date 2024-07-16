import { Circle } from "lucide-react";
import { JettonLogo } from "src/components/common/JettonLogo";
import { Button } from "src/components/ui/Button";
import { ExtendedPosition } from "src/hooks/position/useAllPositions";
import { useBurnCallback } from "src/hooks/position/useBurnCallback";

export const PositionCard = ({ position }: { position: ExtendedPosition }) => {
    const jetton0 = position.position.pool.jetton0;
    const jetton1 = position.position.pool.jetton1;
    const amount0 = position.position.amount0;
    const amount1 = position.position.amount1;
    const lowPrice = position.position.token0PriceLower?.toFixed();
    const highPrice = position.position.token0PriceUpper?.toFixed();

    const { callback } = useBurnCallback({ nftAddress: position.nftAddress });

    return (
        <div className="w-1/4 h-fit flex flex-col bg-light rounded-2xl">
            <div className="flex relative flex-col w-full h-[200px] items-center justify-center bg-border-light/50 rounded-2xl">
                <p>Position</p>
                <p className="text-lg">#{position?.tokenId}</p>
                <div className="flex gap-2 items-center absolute left-2 bottom-2">
                    <Circle size={12} fill="green" color="green" />
                    In range
                </div>
            </div>
            <div className="flex flex-col gap-2 p-2 items-start">
                <p className="opacity-50">Range</p>
                <p>
                    {lowPrice} - {highPrice}
                </p>
                <p className="opacity-50">Amounts</p>
                <div className="flex gap-2">
                    <JettonLogo jetton={jetton0} size={24} />
                    <span>{jetton0?.symbol}:</span>
                    <span>{amount0?.toFixed(4)}</span>
                </div>
                <div className="flex gap-2">
                    <JettonLogo jetton={jetton1} size={24} />
                    <span>{jetton1?.symbol}:</span>
                    <span>{amount1?.toFixed(4)}</span>
                </div>
            </div>
            <div className="flex justify-between p-2">
                <Button className="rounded-xl bg-primary-green">Add +</Button>
                <Button onClick={callback} className="rounded-xl">
                    Remove -
                </Button>
            </div>
        </div>
    );
};
