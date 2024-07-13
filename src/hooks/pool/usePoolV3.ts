import { usePoolV3Contract } from "../contracts/usePoolV3Contract";
import JSBI from "jsbi";
import { Address, OpenedContract } from "@ton/core";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { PoolV3Contract } from "src/sdk/src/contracts/PoolV3Contract";
import useSWR from "swr";
import { useTonClient } from "../common/useTonClient";
import { JettonWallet } from "src/sdk/src/contracts/common/JettonWallet";
import { useAsyncInitialize } from "../common/useAsyncInitialize";
import { parseJettonContent } from "src/utils/jetton/parseJettonContent";
import { JettonMinter } from "src/sdk/src/contracts/common/JettonMinter";

export interface Pool {
    jetton0: Jetton;
    jetton1: Jetton;

    jetton0_wallet: Address;
    jetton1_wallet: Address;
    poolActive: boolean;
    tickSpacing: number;

    tickCurrent: number;
    sqrtRatioX96: JSBI | bigint;
    liquidity: JSBI | bigint;

    nftv3item_counter: number;

    // prevTick: number;
    // nextTick: number;
    // tick: TickInfoWrapper;
    // lp_fee_base: number;
    // protocol_fee: number;
    // lp_fee_current: number;
    // balance: number;
}

const fetchPoolData = (poolContract: OpenedContract<PoolV3Contract> | undefined) => {
    return poolContract?.getPoolStateAndConfiguration();
};

export function usePoolV3(poolAddres: string | undefined): Pool | undefined {
    const client = useTonClient();

    const poolContract = usePoolV3Contract(poolAddres);

    const { data: poolData, error } = useSWR(["poolData", poolContract], () => fetchPoolData(poolContract), {
        revalidateOnFocus: false,
        revalidateOnMount: false,
    });

    if (error) console.error(error);

    const pool = useAsyncInitialize(async () => {
        if (!poolData || !client) return;

        const jetton0Wallet = client.open(new JettonWallet(poolData.jetton0_wallet));
        const jetton1Wallet = client.open(new JettonWallet(poolData.jetton1_wallet));

        const [jetton0MinterAddress, jetton1MinterAddress] = await Promise.all([
            jetton0Wallet.getJettonMinterAddress(),
            jetton1Wallet.getJettonMinterAddress(),
        ]);

        if (!jetton0MinterAddress || !jetton1MinterAddress) throw new Error("Can't get jetton minter address");

        const [jetton0Data, jetton1Data] = await Promise.all([
            client.open(new JettonMinter(jetton0MinterAddress)).getJettonData(),
            client.open(new JettonMinter(jetton1MinterAddress)).getJettonData(),
        ]);

        return {
            jetton0: await parseJettonContent(jetton0MinterAddress.toString(), jetton0Data.content),
            jetton1: await parseJettonContent(jetton1MinterAddress.toString(), jetton1Data.content),

            jetton0_wallet: poolData.jetton0_wallet,
            jetton1_wallet: poolData.jetton1_wallet,
            poolActive: poolData.pool_active,
            tickSpacing: poolData.tick_spacing,

            tickCurrent: poolData.tick,
            sqrtRatioX96: poolData.price_sqrt,
            liquidity: poolData.liquidity,

            nftv3item_counter: poolData.nftv3item_counter,
        };
    }, [poolData, client]);

    return pool;
}
