import { Pool } from "src/hooks/pool/usePoolV3";

export const PoolDetails = ({ pool }: { pool: Pool }) => {
    return (
        <div className="w-full flex flex-col gap-4 bg-light border-2 border-border-light max-sm:p-2 rounded-3xl p-[18px] text-lg">
            <div className="flex flex-col gap-2 items-start bg-dark rounded-xl p-4">
                <p className="opacity-50">Pool Details</p>
                <div className="flex w-full justify-between">
                    <p>Balance</p>
                    <p>{pool.balance}</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>LP Fee Base</p>
                    <p>{(pool.lp_fee_base / 100).toString()} %</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>LP Fee Current</p>
                    <p>{(pool.lp_fee_current / 100).toString()} %</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>SqrtRatioX96</p>
                    <p>{pool.sqrtRatioX96.toString()}</p>
                </div>
            </div>
            <div className="flex flex-col gap-2 items-start bg-dark rounded-xl p-4">
                <p className="opacity-50">Tick info</p>
                <div className="flex w-full justify-between">
                    <p>Current tick</p>
                    <p>{pool.tickCurrent}</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>Prev tick</p>
                    <p>{pool.prevTick}</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>Next tick</p>
                    <p>{pool.nextTick}</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>liquidityGross</p>
                    <p>{pool.tick.liquidityGross.toString()}</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>liquidityNet</p>
                    <p>{pool.tick.liquidityNet.toString()}</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>outerFeeGrowth0Token</p>
                    <p>{pool.tick.outerFeeGrowth0Token.toString()}</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>outerFeeGrowth1Token</p>
                    <p>{pool.tick.outerFeeGrowth1Token.toString()}</p>
                </div>
            </div>
            <hr className="border-border-light" />
            <div className="flex flex-col gap-2 items-start bg-dark rounded-xl p-4">
                <p className="opacity-50">Fees</p>
                <div className="flex w-full justify-between">
                    <p>Protocol fee</p>
                    <p>{(pool.protocol_fee / 100).toString()} %</p>
                </div>
            </div>
        </div>
    );
};
