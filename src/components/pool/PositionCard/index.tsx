import { JettonLogo } from "src/components/common/JettonLogo";
import { ExtendedPosition } from "src/hooks/position/useAllPositions";
import nftStub from "src/assets/nftStub.webp";
import { ManageLiquidityModal } from "src/components/modals/ManageLiquidityModal";
import { useState } from "react";
import { Button } from "src/components/ui/Button";
import TokenRatio from "src/components/create-position/TokenRatio";
import { useDerivedMintInfo } from "src/state/mintStore";
import { POOL } from "src/constants/addresses";
import { cn } from "src/lib/cn";

export const PositionCard = ({ position }: { position: ExtendedPosition }) => {
    const [isOpen, setIsOpen] = useState(false);
    const jetton0 = position.position.pool.jetton0;
    const jetton1 = position.position.pool.jetton1;
    const amount0 = position.position.amount0;
    const amount1 = position.position.amount1;
    const lowPrice = position.position.token0PriceLower?.toFixed();
    const highPrice = position.position.token0PriceUpper?.toFixed();

    const mintInfo = useDerivedMintInfo(
        position.position.pool.jetton0,
        position.position.pool.jetton1,
        POOL, // hardcode
        position.position.pool.fee,
        position.position.pool.jetton0,
        position.position
    );

    const outOfRange = mintInfo.outOfRange;
    const isClosed = position.position.liquidity.toString() === "0";

    return (
        <div className="w-1/4 h-fit flex flex-col gap-2 bg-light rounded-2xl">
            <div className="flex relative flex-col p-4 w-full h-[200px] overflow-clip items-center justify-center bg-border-light/50 rounded-2xl">
                <img className="absolute inset-0 scale-[2]" src={nftStub} />
                <div className="w-fit h-fit py-1 px-2 flex items-center justify-center text-md absolute top-2 left-2 text-black rounded-full bg-white">
                    #{position?.tokenId}
                </div>
                <div className="w-full h-fit py-2 bg-black bg-opacity-50 rounded-xl flex flex-col items-center justify-center z-10">
                    <p>
                        {lowPrice} - {highPrice}
                    </p>
                </div>
                <div className="absolute bottom-2 w-full px-2 text-sm">
                    <TokenRatio mintInfo={mintInfo} />
                </div>
                <div
                    className={cn(
                        "w-fit h-fit py-1 px-2 flex items-center justify-center text-sm absolute top-2 right-2 rounded-full",
                        isClosed ? "bg-black" : outOfRange ? "bg-yellow-600" : "bg-green-600"
                    )}
                >
                    {isClosed ? "Closed" : outOfRange ? "Out of range" : "In range"}
                </div>
            </div>
            <div className="flex flex-col gap-2 p-2 w-full">
                <p className="text-sm mr-auto opacity-50">Amounts</p>
                <div className="flex items-center gap-2 text-sm w-full">
                    <JettonLogo jetton={jetton0} size={22} />
                    {jetton0.symbol}
                    <p className="ml-auto">{amount0.toFixed(4)}</p>
                </div>
                <div className="flex items-center gap-2 text-sm w-full">
                    <JettonLogo jetton={jetton1} size={22} />
                    {jetton1.symbol}
                    <p className="ml-auto">{amount1.toFixed(4)}</p>
                </div>
            </div>
            {/* <Button
                onClick={() => null}
                variant={"outline"}
                className="rounded-xl mx-2  border-blue-500/80 hover:bg-blue-500/20 hover:border-blue-500"
            >
                Collect fees
            </Button> */}
            <Button onClick={() => setIsOpen(true)} variant={"outline"} className="rounded-xl m-2 mt-0">
                Manage
            </Button>
            <ManageLiquidityModal mintInfo={mintInfo} position={position} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    );
};
