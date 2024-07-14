import { useJettonMinterContract } from "../contracts/useJettonMinterContract";
import { Address, OpenedContract } from "@ton/core";
import { JettonMinter } from "src/sdk/src/contracts/common/JettonMinter";
import useSWR from "swr";

interface Props {
    jettonAddress: string | undefined;
    ownerAddress: string | null | undefined;
}

const fetchJettonWallet = (jettonMinter: OpenedContract<JettonMinter> | undefined, ownerAddress: string | null | undefined) => {
    if (!jettonMinter || !ownerAddress) return;
    return jettonMinter.getWalletAddress(Address.parse(ownerAddress));
};

export function useJettonWalletAddress({ jettonAddress, ownerAddress }: Props) {
    const jettonMinter = useJettonMinterContract(jettonAddress);

    const { data: jettonWalletAddress, error } = useSWR(
        ["jettonWalletAddress", jettonMinter, ownerAddress],
        () => fetchJettonWallet(jettonMinter, ownerAddress),
        {
            revalidateOnFocus: false,
            revalidateOnMount: false,
        }
    );

    if (error) console.error(error);

    return jettonWalletAddress?.toString();
}
