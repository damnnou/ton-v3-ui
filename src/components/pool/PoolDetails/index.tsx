import { Pool } from "src/hooks/pool/usePool";
import { formatUnits } from "src/utils/common/formatUnits";

export const PoolDetails = ({ pool }: { pool: Pool }) => {
    const reserve0 = formatUnits(pool.reserve0, pool.token0.decimals);
    const reserve1 = formatUnits(pool.reserve1, pool.token1.decimals);
    const token0Rate = reserve1 / reserve0;
    const token1Rate = reserve0 / reserve1;

    /* tokens sum TVL */
    const TVL = formatUnits(pool.reserve0, pool.token0.decimals) + formatUnits(pool.reserve1, pool.token1.decimals);
    return (
        <div className="w-full flex flex-col gap-4 bg-light border-2 border-border-light rounded-2xl p-6 text-lg">
            <div className="flex flex-col gap-2 items-start">
                <p className="opacity-50">Details</p>
                <div className="flex w-full justify-between">
                    <p>LP Fee</p>
                    <p>{(pool.lpFee / 100).toString()} %</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>TVL</p>
                    <p>{TVL.toLocaleString()} tokens</p>
                </div>
            </div>
            <hr className="border-border-light" />
            <div className="flex flex-col gap-2 items-start">
                <p className="opacity-50">Token rates</p>
                <p>
                    1 {pool.token0.symbol} = {token0Rate} {pool.token1.symbol}
                </p>
                <p>
                    1 {pool.token1.symbol} = {token1Rate} {pool.token0.symbol}
                </p>
            </div>
            <hr className="border-border-light" />
            <div className="flex flex-col gap-2 items-start">
                <p className="opacity-50">Pool reserve</p>
                <div className="flex w-full justify-between">
                    <p>{pool.token0.symbol}</p>
                    <p>{reserve0.toLocaleString()}</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>{pool.token1.symbol}</p>
                    <p>{reserve1.toLocaleString()}</p>
                </div>
            </div>
            <hr className="border-border-light" />
            <div className="flex flex-col gap-2 items-start">
                <p className="opacity-50">Fees</p>
                <div className="flex w-full justify-between">
                    <p>Protocol fee</p>
                    <p>{(pool.protocolFee / 100).toString()} %</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>Ref fee</p>
                    <p>{(pool.refFee / 100).toString()} %</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>Collected {pool.token0.symbol} protocol fee</p>
                    <p>{formatUnits(pool.collectedToken0ProtocolFee, pool.token0.decimals).toLocaleString()}</p>
                </div>
                <div className="flex w-full justify-between">
                    <p>Collected {pool.token1.symbol} protocol fee</p>
                    <p>{formatUnits(pool.collectedToken1ProtocolFee, pool.token1.decimals).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};
