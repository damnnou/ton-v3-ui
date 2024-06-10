import { AddressType } from "@ston-fi/sdk";
import { useEffect, useState } from "react";
import { useTonConnect } from "../common/useTonConnect";
import { Jetton, jettons } from "src/constants/jettons";

export function useJetton(address: AddressType | undefined) {
    const [jetton, setJetton] = useState<Jetton>();
    const { network } = useTonConnect();

    useEffect(() => {
        if (!network) return;
        Object.entries(jettons[network]).map(([, jetton]) => jetton.address === address && setJetton(jetton));
    }, [network, address]);

    return jetton;
}
