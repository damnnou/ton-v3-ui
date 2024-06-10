import { ColumnDef } from "@tanstack/react-table";
import { HeaderItem } from "./common";
// import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
// import { formatPercent } from "@/utils/common/formatPercent";
import { Jetton } from "src/constants/jettons";
import { AddressType } from "@ston-fi/sdk";
import { formatUSD } from "src/utils/common/formatUSD";

interface Pair {
    token0: Jetton;
    token1: Jetton;
}

interface Pool {
    id: AddressType;
    pair: Pair;
    fee: number;
    tvlUSD: number;
    volume24USD: number;
    poolMaxApr: number;
    poolAvgApr: number;
    avgApr: number;
    farmApr: number;
    isMyPool: boolean;
    hasActiveFarming: boolean;
}

const PoolPair = ({ pair, fee }: Pool) => {
    const currencyA = pair.token0;
    const currencyB = pair.token1;

    if (!currencyA || !currencyB) return null;

    return (
        <div className="flex items-center gap-4 ml-2">
            <div className="flex">
                <img className="rounded-full" src={currencyA.logo} width={30} height={30} />
                <img className="rounded-full -ml-2" src={currencyB.logo} width={30} height={30} />
            </div>
            <div>{`${currencyA.symbol} - ${currencyB.symbol}`}</div>
            <div className="bg-primary-red/30 text-pink-300 rounded-xl px-2 py-1 text-sm">{`${fee / 100}%`}</div>
        </div>
    );
};

// const Plugins = ({ poolId }: { poolId: AddressType }) => {
//     const { dynamicFeePlugin, farmingPlugin } = usePoolPlugins(poolId);

//     return (
//         <div className="flex gap-2">
//             {dynamicFeePlugin && <DynamicFeePluginIcon />}
//             {farmingPlugin && <FarmingPluginIcon />}
//         </div>
//     );
// };

// const AvgAPR = ({
//     children,
//     avgApr,
//     farmApr,
//     maxApr,
// }: {
//     children: ReactNode;
//     avgApr: string;
//     farmApr: string | undefined;
//     maxApr: string;
// }) => {
//     return (
//         <HoverCard>
//             <HoverCardTrigger>{children}</HoverCardTrigger>
//             <HoverCardContent>
//                 <p>Avg. APR - {avgApr}</p>
//                 {farmApr && <p>Farm APR - {farmApr}</p>}
//                 <p>Max APR - {maxApr}</p>
//             </HoverCardContent>
//         </HoverCard>
//     );
// };

export const poolsColumns: ColumnDef<Pool>[] = [
    {
        accessorKey: "pair",
        header: () => <HeaderItem className="ml-2">Pool</HeaderItem>,
        cell: ({ row }) => <PoolPair {...row.original} />,
        filterFn: (v, _, value) =>
            [v.original.pair.token0.symbol, v.original.pair.token1.symbol, v.original.pair.token0.symbol, v.original.pair.token1.symbol]
                .join(" ")
                .toLowerCase()
                .includes(value),
    },
    // {
    //     accessorKey: "plugins",
    //     header: () => <HeaderItem>Plugins</HeaderItem>,
    //     cell: ({ row }) => <Plugins poolId={row.original.id} />,
    //     filterFn: (v) => v.original.hasActiveFarming === true,
    // },
    {
        accessorKey: "tvlUSD",
        header: ({ column }) => (
            <HeaderItem sort={() => column.toggleSorting(column.getIsSorted() === "asc")} isAsc={column.getIsSorted() === "asc"}>
                TVL
            </HeaderItem>
        ),
        cell: ({ getValue }) => formatUSD.format(getValue() as number),
    },
    {
        accessorKey: "volume24USD",
        header: ({ column }) => (
            <HeaderItem sort={() => column.toggleSorting(column.getIsSorted() === "asc")} isAsc={column.getIsSorted() === "asc"}>
                Volume 24H
            </HeaderItem>
        ),
        cell: ({ getValue }) => formatUSD.format(getValue() as number),
    },
    {
        accessorKey: "fees24USD",
        header: ({ column }) => (
            <HeaderItem sort={() => column.toggleSorting(column.getIsSorted() === "asc")} isAsc={column.getIsSorted() === "asc"}>
                Fees 24H
            </HeaderItem>
        ),
        cell: ({ getValue }) => formatUSD.format(getValue() as number),
    },
    {
        accessorKey: "avgApr",
        header: ({ column }) => (
            <HeaderItem sort={() => column.toggleSorting(column.getIsSorted() === "asc")} isAsc={column.getIsSorted() === "asc"}>
                Avg. APR
            </HeaderItem>
        ),
        cell: ({ getValue }) => {
            return getValue() as number;
            // return (
            //     <AvgAPR
            //         avgApr={formatPercent.format(row.original.poolAvgApr / 100)}
            //         maxApr={formatPercent.format(row.original.poolMaxApr / 100)}
            //         farmApr={row.original.hasActiveFarming ? formatPercent.format(row.original.farmApr / 100) : undefined}
            //     >
            //         {formatPercent.format((getValue() as number) / 100)}
            //     </AvgAPR>
            // );
        },
    },
];
