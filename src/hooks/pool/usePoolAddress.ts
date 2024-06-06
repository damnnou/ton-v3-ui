import { useEffect, useState } from "react";
import { AddressType } from "tonweb";
import { useRouterContract } from "../contracts/useRouterContract";

export function usePoolAddress({ token0, token1 }: { token0: AddressType | undefined; token1: AddressType | undefined }) {
    const [poolAddress, setPoolAddress] = useState<AddressType>();

    const router = useRouterContract();

    useEffect(() => {
        if (!token0 || !token1 || !router) return;

        router.getPoolAddress({ token0, token1 }).then((v) => setPoolAddress(v?.toString()));
    }, [token0, token1, router]);

    return poolAddress;
}
