import { useEffect, useState } from "react";
import { useTokensState } from "src/state/tokensStore";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { useJettonMinterContract } from "../contracts/useJettonMinterContract";
import { displayContentCell } from "src/sdk/src/contracts/common/jettonContent";

export function useJetton(jettonMinterAddress: string | undefined): Jetton | undefined {
    const [jetton, setJetton] = useState<Jetton>();
    const { importedTokens } = useTokensState();
    const jettonMinter = useJettonMinterContract(jettonMinterAddress);

    useEffect(() => {
        if (!jettonMinterAddress || !jettonMinter) return;
        const allTokens = Object.values(importedTokens);
        const token = allTokens.find((jetton) => jetton.address.toLowerCase() === jettonMinterAddress.toLowerCase());
        if (token) {
            setJetton(new Jetton(token.address, token.decimals, token.symbol, token.name, token.image));
            return;
        }

        /* fetch and parse metadata */
        const fetchJettonData = async () => {
            const jettonData = await jettonMinter.getJettonData();
            const metadata = await displayContentCell(jettonData.content);

            return metadata;
        };
        
        fetchJettonData().then((metadata) => {
            if (!metadata) throw new Error("Jetton data not found");
            setJetton(new Jetton(jettonMinterAddress, Number(metadata.decimals), metadata.symbol, metadata.name, metadata.image));
        });
    }, [jettonMinterAddress, jettonMinter, importedTokens]);

    return jetton;
}

// export function useJettonByJettonWallet(jettonWalletAddress: AddressType | undefined) {
//     const [jettonAddress, setJettonAddress] = useState<AddressType>();

//     const jettonWallet = useJettonWalletContract(jettonWalletAddress);

//     const jetton = useJetton(jettonAddress);

//     useEffect(() => {
//         if (!jettonWallet) return;

//         jettonWallet.getData().then((data) => setJettonAddress(data.jettonMinterAddress));
//     }, [jettonWallet]);

//     return jetton;
// }
