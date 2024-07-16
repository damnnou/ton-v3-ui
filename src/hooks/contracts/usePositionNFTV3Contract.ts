import { useAsyncInitialize } from "../common/useAsyncInitialize";
import { Address, OpenedContract } from "@ton/core";
import { useTonClient } from "../common/useTonClient.tsx";
import { PositionNFTV3Contract } from "src/sdk/src/contracts/PositionNFTV3Contract.ts";

export function usePositionNFTV3Contract(nftAddress: string | undefined) {
    const client = useTonClient();

    const poolV3Contract = useAsyncInitialize(async () => {
        if (!client || !nftAddress) return;

        const contract = new PositionNFTV3Contract(Address.parse(nftAddress));

        return client.open(contract) as OpenedContract<PositionNFTV3Contract>;
    }, [client, nftAddress]);

    return poolV3Contract;
}
