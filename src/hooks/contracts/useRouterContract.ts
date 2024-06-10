import { useTonClient } from "../common/useTonClient";
import { useMemo } from "react";
import { Router } from "src/contracts/Router";
import { useTonConnect } from "../common/useTonConnect";
import { ROUTER } from "src/constants/addresses";
import { CHAIN } from "@tonconnect/ui-react";

export function useRouterContract() {
    const tonApiClient = useTonClient();

    const { network } = useTonConnect();

    return useMemo(() => {
        if (!tonApiClient) return;
        return new Router({ tonApiClient: tonApiClient.provider, address: ROUTER[network || CHAIN.MAINNET] });
    }, [tonApiClient, network]);
}
