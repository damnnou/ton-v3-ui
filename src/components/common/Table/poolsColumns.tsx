import { ColumnDef } from "@tanstack/react-table";
import { HeaderItem } from "./common";
import { Jetton } from "src/constants/jettons";
import { AddressType } from "@ston-fi/sdk";
import { formatUSD } from "src/utils/common/formatUSD";
import { JettonLogo } from "../JettonLogo";

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
    const jettonA = pair.token0;
    const jettonB = pair.token1;

    if (!jettonA || !jettonB) return null;

    return (
        <div className="flex items-center gap-4 ml-2">
            <div className="flex">
                <JettonLogo jetton={jettonA} size={30} />
                <JettonLogo className="-ml-2" jetton={jettonB} size={30} />
            </div>
            <div>{`${jettonA.symbol} - ${jettonB.symbol}`}</div>
            <div className="bg-primary-red/30 text-pink-300 rounded-xl px-2 py-1 text-sm">{`${fee / 100}%`}</div>
        </div>
    );
};

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
