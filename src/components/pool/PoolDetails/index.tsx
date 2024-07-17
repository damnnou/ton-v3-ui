import { Pool } from "src/sdk/src";

export const PoolDetails = ({ pool }: { pool: Pool }) => {
    return (
        <div className="flex w-1/3 flex-col gap-4 bg-light max-sm:p-2 rounded-2xl p-[18px] text-lg">
            <div className="flex flex-col gap-2 items-start bg-dark rounded-xl p-4">
                <p className="opacity-50">Pool Details</p>
                <div className="flex w-full justify-between">
                    <p>LP Fee</p>
                    <p>{(pool.fee / 100).toString()} %</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>Reserve</p>
                    <p>0</p>
                </div>
            </div>
            <div className="flex flex-col gap-2 items-start bg-dark rounded-xl p-4">
                <p className="opacity-50">Tick info</p>
                <div className="flex w-full justify-between">
                    <p>Current tick</p>
                    <p>{pool.tickCurrent}</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>Tick spacing</p>
                    <p>{pool.tickSpacing}</p>
                </div>
            </div>
            <div className="flex flex-col gap-2 items-start bg-dark rounded-xl p-4">
                <p className="opacity-50">Price info</p>
                <div className="flex w-full justify-between">
                    <p>{pool.jetton0.symbol} Price</p>
                    <p>{pool.jetton0Price.toFixed()}</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>{pool.jetton1.symbol} Price</p>
                    <p>{pool.jetton1Price.toFixed()}</p>
                </div>
            </div>
        </div>
    );
};
