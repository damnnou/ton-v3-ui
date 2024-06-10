import PoolsTable from "../common/Table/poolsTable";
import { poolsColumns } from "../common/Table/poolsColumns";
import { useMemo } from "react";
import { useAllPools } from "src/hooks/pool/useAllPools";
import { formatUnits } from "src/utils/common/formatUnits";

const PoolsList = () => {
    // const { data: pools, isLoading } = useSWR<PoolList>(POOLS_LIST_API, fetcher, {
    //     revalidateOnFocus: false,
    //     revalidateIfStale: false,
    //     revalidateOnReconnect: false,
    // });

    const { isLoading, data: pools } = useAllPools();

    const formattedPools = useMemo(() => {
        if (isLoading || !pools) return [];

        return pools.map(({ address, token0, token1, lpFee, reserve0, reserve1 }) => {
            return {
                id: address,
                pair: {
                    token0,
                    token1,
                },
                fee: lpFee,
                tvlUSD: formatUnits(reserve0, token0.decimals) + formatUnits(reserve1, token1.decimals),
                volume24USD: 0,
                fees24USD: 0,
                poolMaxApr: 0,
                poolAvgApr: 0,
                avgApr: 0,
                // volume24USD: timeDifference <= msIn24Hours ? currentPool.volumeUSD : 0,
                // fees24USD: timeDifference <= msIn24Hours ? currentPool.feesUSD : 0,
                // isMyPool: Boolean(openPositions?.length),
                // hasActiveFarming: Boolean(activeFarming),
            };
        });
    }, [isLoading, pools]);

    return (
        <div className="flex flex-col gap-4">
            <PoolsTable
                columns={poolsColumns}
                data={formattedPools}
                defaultSortingID={"tvlUSD"}
                link={"pool"}
                showPagination={true}
                loading={isLoading}
            />
        </div>
    );
};

export default PoolsList;
