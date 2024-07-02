import { Skeleton } from "src/components/ui/Skeleton";
import { jettons } from "src/constants/jettons";
import { usePoolV3 } from "src/hooks/pool/usePoolV3";

const POOL_ADDRESS = "EQB6Zp8Z2P7hLxJpZDqQw3Z6yX3YpSjJrXqE9TmZ5D8Q";

const V3Page = () => {
    const pool = usePoolV3(POOL_ADDRESS);
    const jetton0 = jettons.TON;
    const jetton1 = jettons.USDT;

    if (!jetton0 || !jetton1) {
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
                    {jetton0?.symbol} / {jetton1?.symbol}
                </h2>
            </div>
            <div className="flex max-lg:flex-col gap-4">
                <div className="w-fit lg:min-w-[500px] flex flex-col gap-4">
                    {/* <RefundLiquidity pool={pool} />
                    <AddLiquidity pool={pool} /> */}
                </div>
            </div>
        </div>
    );
};

export default V3Page;
