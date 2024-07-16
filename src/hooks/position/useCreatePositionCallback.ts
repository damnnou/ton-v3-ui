import { useCallback, useMemo } from "react";
import { Address, beginCell, Cell, toNano } from "@ton/core";
import { ContractOpcodes } from "src/sdk/src/contracts/opCodes";
import { useTonConnect } from "../common/useTonConnect";
import { useJettonWalletAddress } from "../jetton/useJettonWalletAddress";
import { POOL, ROUTER } from "src/constants/addresses";
import { SwapCallbackState } from "src/types/swap-state";
import { JettonWallet } from "src/sdk/src/contracts/common/JettonWallet";
import { IDerivedMintInfo } from "src/state/mintStore";
import { usePoolV3Contract } from "../contracts/usePoolV3Contract";
import { TickMath } from "src/sdk/src";
import { parseUnits } from "src/utils/common/parseUnits";

export function useCreatePositionCallback({
    mintInfo,
    jetton0Amount,
    jetton1Amount,
}: {
    mintInfo: IDerivedMintInfo | undefined;
    jetton0Amount: string | undefined;
    jetton1Amount: string | undefined;
}) {
    const { sender, wallet } = useTonConnect();

    const pool = mintInfo?.pool;
    const position = mintInfo?.position;

    const jetton0Wallet = useJettonWalletAddress({ jettonAddress: pool?.jetton0.address, ownerAddress: wallet });
    const jetton1Wallet = useJettonWalletAddress({ jettonAddress: pool?.jetton1.address, ownerAddress: wallet });

    /* TODO: get it from pool entity */
    const routerJetton0Wallet = useJettonWalletAddress({ jettonAddress: pool?.jetton0.address, ownerAddress: ROUTER });
    const routerJetton1Wallet = useJettonWalletAddress({ jettonAddress: pool?.jetton1.address, ownerAddress: ROUTER });

    const poolV3Contract = usePoolV3Contract(POOL);

    const mintCallback = useCallback(async () => {
        if (
            !wallet ||
            !jetton0Wallet ||
            !jetton1Wallet ||
            !jetton0Amount ||
            !jetton1Amount ||
            !pool ||
            !position ||
            !routerJetton0Wallet ||
            !routerJetton1Wallet ||
            !poolV3Contract
        ) {
            console.log(jetton0Wallet, jetton1Wallet, wallet, jetton0Amount, pool, position, routerJetton0Wallet, routerJetton1Wallet);
            return;
        }

        // const priceMin = TickMath.getSqrtRatioAtTick(position.tickLower);
        // const priceMax = TickMath.getSqrtRatioAtTick(position.tickUpper);

        // const jetton0AmountNew = await poolV3Contract.getAmount0DeltaR(
        //     BigInt(pool.sqrtRatioX96.toString()),
        //     BigInt(priceMax.toString()),
        //     BigInt(position.liquidity.toString()),
        //     true
        // );
        // const jetton1AmountNew = await poolV3Contract.getAmount1DeltaR(
        //     BigInt(pool.sqrtRatioX96.toString()),
        //     BigInt(priceMin.toString()),
        //     BigInt(position.liquidity.toString()),
        //     true
        // );

        const jetton0AmountNew = parseUnits(jetton0Amount, pool.jetton0.decimals);
        const jetton1AmountNew = parseUnits(jetton1Amount, pool.jetton1.decimals);

        const mintRequest0 = beginCell()
            .storeUint(ContractOpcodes.POOLV3_FUND_ACCOUNT, 32) // Request to minting part 1
            .storeAddress(Address.parse(routerJetton1Wallet)) // Jetton1 Wallet attached to Router is used to identify target token
            .storeCoins(jetton0AmountNew)
            .storeCoins(jetton1AmountNew)
            .storeUint(BigInt(position.liquidity.toString()), 128) // Liquidity. First transaction don't want actully to mint anything.
            .storeInt(BigInt(position.tickLower.toString()), 24) // Min tick.  Actually for the part 1 could be 0 it is ignored
            .storeInt(BigInt(position.tickUpper.toString()), 24) // Max tick.  Actually for the part 1 could be 0 it is ignored
            .endCell();

        const mintRequest1 = beginCell()
            .storeUint(ContractOpcodes.POOLV3_FUND_ACCOUNT, 32) // Request to minting part 2
            .storeAddress(Address.parse(routerJetton0Wallet)) // Jetton1 Wallet attached to Router is used to identify target token
            .storeCoins(jetton0AmountNew)
            .storeCoins(jetton1AmountNew)
            .storeUint(BigInt(position.liquidity.toString()), 128) // Liquidity to mint
            .storeInt(BigInt(position.tickLower.toString()), 24) // Min tick.
            .storeInt(BigInt(position.tickUpper.toString()), 24) // Max tick.
            .endCell();

        const payload0 = JettonWallet.transferMessage(
            jetton0AmountNew,
            Address.parse(ROUTER),
            Address.parse(wallet),
            new Cell(),
            toNano(0.2),
            mintRequest0
        );

        const payload1 = JettonWallet.transferMessage(
            jetton1AmountNew,
            Address.parse(ROUTER),
            Address.parse(wallet),
            new Cell(),
            toNano(0.2),
            mintRequest1
        );

        const messages = [
            {
                to: Address.parse(jetton1Wallet),
                value: toNano(0.5),
                body: payload1,
            },
            {
                to: Address.parse(jetton0Wallet),
                value: toNano(0.5),
                body: payload0,
            },
        ];

        sender.sendMiltiple(messages);

        console.log(
            "jetton0Amount: ",
            jetton0AmountNew,
            "jetton1Amount: ",
            jetton1AmountNew,
            "tickLower: ",
            position.tickLower,
            "tickUpper: ",
            position.tickUpper,
            "liquidity: ",
            position.liquidity.toString()
        );
    }, [
        wallet,
        jetton0Wallet,
        jetton1Wallet,
        jetton0Amount,
        jetton1Amount,
        pool,
        position,
        routerJetton0Wallet,
        routerJetton1Wallet,
        poolV3Contract,
        sender,
    ]);

    return useMemo(() => {
        return {
            state: SwapCallbackState.VALID,
            callback: mintCallback,
            error: null,
        };
    }, [mintCallback]);
}
