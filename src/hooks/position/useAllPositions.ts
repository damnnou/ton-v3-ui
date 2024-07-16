import useSWR from "swr";
import { useTonConsoleClient } from "../common/useTonConsoleClient";
import { Api } from "tonapi-sdk-js";
import { useEffect, useState } from "react";
import { useTonClient } from "../common/useTonClient";
import { PositionNFTV3Contract } from "src/sdk/src/contracts/PositionNFTV3Contract";
import { Address } from "@ton/core";
import { Pool, Position } from "src/sdk/src";

export interface ExtendedPosition {
    position: Position;
    tokenId: number;
    nftAddress: string;
}

const fetchAllNFTs = async (client: Api<unknown>, collection: string | undefined, wallet: string | null) => {
    if (!client || !collection || !wallet) throw new Error("Can't fetch positions without ton client or collection address or wallet");
    return client.accounts.getAccountNftItems(wallet, {
        collection,
    });
};

export function useAllPositions({
    pool,
    poolAddress,
    wallet,
}: {
    pool: Pool | null | undefined;
    poolAddress: string | undefined;
    wallet: string | null;
}) {
    const [positions, setPositions] = useState<ExtendedPosition[]>();
    const [isLoading, setIsLoading] = useState(false);
    const tonClient = useTonClient();
    const client = useTonConsoleClient();

    const { data, isLoading: isAllPositionLoading } = useSWR(["allPositions", wallet], () => fetchAllNFTs(client, poolAddress, wallet), {
        revalidateOnFocus: false,
        revalidateOnMount: false,
        refreshInterval: 10000,
    });

    useEffect(() => {
        if (!pool || !tonClient || !data) return;

        setIsLoading(true);

        const fetchPositionsData = async () => {
            const positionsData = [];
            for (const nftItem of data.nft_items) {
                const contract = new PositionNFTV3Contract(Address.parse(nftItem.address));
                const positionNFTV3Contract = tonClient.open(contract);
                const positionData = await positionNFTV3Contract.getPositionInfo();
                const position = new Position({
                    pool,
                    tickLower: positionData.tickLow,
                    tickUpper: positionData.tickHigh,
                    liquidity: positionData.liquidity.toString(),
                });

                positionsData.push({ position, tokenId: nftItem.index, nftAddress: nftItem.address });
            }

            return positionsData;
        };

        fetchPositionsData().then((positions) => {
            console.log(positions);
            setPositions(positions);
            setIsLoading(false);
        });
    }, [poolAddress, tonClient, data, pool]);

    return { positions, isLoading: isLoading || isAllPositionLoading };
}
