import { usePoolV3Contract } from "../contracts/usePoolV3Contract";
import JSBI from "jsbi";
import { useEffect, useState } from "react";
import { Address } from "@ton/core";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { displayContentCell } from "src/sdk/src/contracts/common/jettonContent";
import { useJettonMinterContract } from "../contracts/useJettonMinterContract";
import { TickInfoWrapper } from "src/sdk/src/contracts/PoolV3Contract";
import { jettons } from "src/constants/jettons";

export interface Pool {
    jetton0: Jetton;
    jetton1: Jetton;
    jetton0Wallet: Address;
    jetton1Wallet: Address;
    sqrtRatioX96: JSBI | bigint;
    liquidity: JSBI | bigint;
    tickCurrent: number;
    // tickDataProvider: TickDataProvider;
    tickSpacing: number;
    prevTick: number;
    nextTick: number;
    tick: TickInfoWrapper;
    lp_fee_base: number;
    protocol_fee: number;
    lp_fee_current: number;
    balance: number;
}

export function usePoolV3(poolAddres: string | undefined): Pool | undefined {
    /* hard coded token addresses */
    const [token0Address, setToken0Address] = useState<Address>(Address.parse(jettons.ALG_USD.address));
    const [token1Address, setToken1Address] = useState<Address>(Address.parse(jettons.ALG_ETH.address));

    const [poolData, setPoolData] = useState<Pool>();

    const poolContract = usePoolV3Contract(poolAddres);
    const jetton0Minter = useJettonMinterContract(token0Address?.toString());
    const jetton1Minter = useJettonMinterContract(token1Address?.toString());

    // useEffect(() => {
    //     if (!poolContract || (jetton0Minter && jetton1Minter)) return;
    //     poolContract.getTokenAddresses().then(({ token0_address, token1_address }) => {
    //         setToken0Address(token0_address);
    //         setToken1Address(token1_address);
    //     });
    // }, [poolContract, jetton0Minter, jetton1Minter]);

    useEffect(() => {
        if (!poolContract || !poolAddres || !jetton0Minter || !jetton1Minter) return;

        const fetchData = async () => {
            const { liquidity, priceSqrt: sqrtRatioX96 } = await poolContract.getPriceAndLiquidity();
            const tickCurrent = await poolContract.getTick();
            const { tick, prevTick, nextTick } = await poolContract.getTickInfo(tickCurrent);
            const fees = await poolContract.getFees();
            const { number: balance } = await poolContract.getBalance();

            const jetton0Wallet = await jetton0Minter.getWalletAddress(poolContract.address);
            const jetton1Wallet = await jetton1Minter.getWalletAddress(poolContract.address);

            const jetton0Data = await displayContentCell((await jetton0Minter.getJettonData()).content);
            const jetton1Data = await displayContentCell((await jetton1Minter.getJettonData()).content);

            if (!jetton0Data || !jetton1Data) throw new Error("Jettons not found");

            const jetton0 = new Jetton(
                jetton0Minter.address.toString(),
                Number(jetton0Data.decimals),
                jetton0Data.symbol,
                jetton0Data.name,
                jetton0Data.image
            );
            const jetton1 = new Jetton(
                jetton1Minter.address.toString(),
                Number(jetton1Data.decimals),
                jetton1Data.symbol,
                jetton1Data.name,
                jetton1Data.image
            );

            setPoolData({
                jetton0,
                jetton1,
                jetton0Wallet,
                jetton1Wallet,
                sqrtRatioX96,
                liquidity,
                tickCurrent,
                // tickDataProvider: new NoTickDataProvider(),
                tickSpacing: 60,
                prevTick,
                nextTick,
                tick,
                ...fees,
                balance,
            });
        };

        fetchData();
    }, [poolContract, poolAddres, jetton0Minter, jetton1Minter]);

    return poolData;
}
