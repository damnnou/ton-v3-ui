import { useTonClient } from "../common/useTonClient";
import { useMemo } from "react";
import { Router } from "src/contracts/Router";
import { ROUTER } from "src/constants/addresses";

export function useRouterContract() {
    const tonApiClient = useTonClient();

    return useMemo(() => {
        if (!tonApiClient) return;
        return new Router({ tonApiClient: tonApiClient.provider, address: ROUTER });
    }, [tonApiClient]);
}
