import { useMemo } from "react";
import { AddressType } from "tonweb";
import { useTonClient } from "../common/useTonClient";
import { Pool } from "src/contracts/Pool";

export function usePoolContract(pool: AddressType | undefined) {
    const tonApiClient = useTonClient();

    return useMemo(() => {
        if (!tonApiClient || !pool) return;

        return new Pool({ tonApiClient, address: pool });
    }, [tonApiClient, pool]);
}
