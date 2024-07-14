import PoolsTable from "../common/Table/poolsTable";
import { poolsColumns } from "../common/Table/poolsColumns";
import { useMemo } from "react";
import { POOL } from "src/constants/addresses";
import { usePoolV3 } from "src/hooks/pool/usePoolV3";

const PoolsList = () => {
    // const { data: pools, isLoading } = useSWR<PoolList>(POOLS_LIST_API, fetcher, {
    //     revalidateOnFocus: false,
    //     revalidateIfStale: false,
    //     revalidateOnReconnect: false,
    // });

    // const { isLoading, data: pools } = useAllPools();

    const [, pool] = usePoolV3(POOL);

    const formattedPools = useMemo(() => {
        if (!pool) return [];

        return [
            {
                id: POOL,
                pair: {
                    token0: pool?.jetton0,
                    token1: pool?.jetton1,
                },
                fee: 60,
                tvlUSD: 0,
                volume24USD: 0,
                fees24USD: 0,
                poolMaxApr: 0,
                poolAvgApr: 0,
                avgApr: 0,
            },
        ];
    }, [pool]);

    return (
        <div className="flex flex-col gap-4">
            <PoolsTable
                columns={poolsColumns}
                data={formattedPools as any}
                defaultSortingID={"tvlUSD"}
                link={"pool"}
                showPagination={true}
                loading={!pool}
            />
        </div>
    );
};

export default PoolsList;
