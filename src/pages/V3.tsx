import { SwapButton } from "src/components/swap/SwapButton";
import SwapPair from "src/components/swap/SwapPair";
import { Skeleton } from "src/components/ui/Skeleton";
import { POOL } from "src/constants/addresses";
import { usePoolV3 } from "src/hooks/pool/usePoolV3";

const V3Page = () => {
    const pool = usePoolV3(POOL);

    console.log(pool);

    const jetton0 = pool?.jetton0;
    const jetton1 = pool?.jetton1;

    if (!jetton0 || !jetton1 || !pool) {
        return (
            <div className="flex flex-col gap-6 py-20">
                <Skeleton className="w-64 h-10 mr-auto  animate-pulse" />
                <Skeleton className="w-80 h-16" />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-6 py-20 animate-fade-in">
            <div className="flex items-center gap-4">
                <div className="flex">
                    <img className="rounded-full" src={jetton0.image} width={42} height={42} />
                    <img className="rounded-full -ml-2" src={jetton1.image} width={42} height={42} />
                </div>
                <h2 className="text-3xl mr-auto">
                    {jetton0.symbol} / {jetton1.symbol}
                </h2>
            </div>
            <div className="flex max-lg:flex-col gap-4">
                <div className="relative w-3/4 rounded-2xl transition-all duration-300 bg-light delay-50 overflow-hidden shadow-2xl shadow-purple-500/10 flex flex-col sm:gap-4 gap-2 border-2 border-border-light sm:p-4 sm:rounded-3xl sm:bg-light p-2 h-[318px] sm:h-[350px]">
                    <div className="flex flex-col sm:gap-4 gap-2">
                        <SwapPair />
                        <SwapButton />
                    </div>
                </div>
                {/* <PoolDetails pool={pool} /> */}
            </div>
        </div>
    );
};

export default V3Page;
