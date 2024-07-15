import { useCallback, useMemo } from "react";
import { Address, beginCell, Cell, toNano } from "@ton/core";
import { ContractOpcodes } from "src/sdk/src/contracts/opCodes";
import { parseUnits } from "src/utils/common/parseUnits";
import { useTonConnect } from "../common/useTonConnect";
import { useJettonWalletAddress } from "../jetton/useJettonWalletAddress";
import { ROUTER } from "src/constants/addresses";
import { SwapCallbackState } from "src/types/swap-state";
import { JettonWallet } from "src/sdk/src/contracts/common/JettonWallet";
import { IDerivedMintInfo } from "src/state/mintStore";

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

    const mintCallback = useCallback(() => {
        if (
            !wallet ||
            !jetton0Wallet ||
            !jetton1Wallet ||
            (!jetton0Amount && !jetton1Amount) ||
            !pool ||
            !position ||
            !routerJetton0Wallet ||
            !routerJetton1Wallet
        ) {
            console.log(jetton0Wallet, jetton1Wallet, wallet, jetton0Amount, pool, position, routerJetton0Wallet, routerJetton1Wallet);
            return;
        }

        const mintRequest0 = beginCell()
            .storeUint(ContractOpcodes.POOLV3_FUND_ACCOUNT, 32) // Request to minting part 1
            .storeAddress(Address.parse(routerJetton1Wallet)) // Jetton1 Wallet attached to Router is used to identify target token
            .storeCoins(parseUnits(jetton0Amount || "0", pool.jetton0.decimals))
            .storeCoins(parseUnits(jetton1Amount || "0", pool.jetton1.decimals))
            .storeUint(BigInt(position.liquidity.toString()), 128) // Liquidity. First transaction don't want actully to mint anything.
            .storeInt(BigInt(position.tickLower.toString()), 24) // Min tick.  Actually for the part 1 could be 0 it is ignored
            .storeInt(BigInt(position.tickUpper.toString()), 24) // Max tick.  Actually for the part 1 could be 0 it is ignored
            .endCell();

        const mintRequest1 = beginCell()
            .storeUint(ContractOpcodes.POOLV3_FUND_ACCOUNT, 32) // Request to minting part 2
            .storeAddress(Address.parse(routerJetton0Wallet)) // Jetton1 Wallet attached to Router is used to identify target token
            .storeCoins(parseUnits(jetton0Amount || "0", pool.jetton0.decimals))
            .storeCoins(parseUnits(jetton1Amount || "0", pool.jetton1.decimals))
            .storeUint(BigInt(position.liquidity.toString()), 128) // Liquidity to mint
            .storeInt(BigInt(position.tickLower.toString()), 24) // Min tick.
            .storeInt(BigInt(position.tickUpper.toString()), 24) // Max tick.
            .endCell();

        const payload0 = JettonWallet.transferMessage(
            parseUnits(jetton0Amount || "0", pool.jetton0.decimals),
            Address.parse(ROUTER),
            Address.parse(wallet),
            new Cell(),
            toNano(0.2),
            mintRequest0
        );

        const payload1 = JettonWallet.transferMessage(
            parseUnits(jetton1Amount || "0", pool.jetton0.decimals),
            Address.parse(ROUTER),
            Address.parse(wallet),
            new Cell(),
            toNano(0.2),
            mintRequest1
        );

        sender.sendMiltiple([
            {
                to: Address.parse(jetton0Wallet),
                value: toNano(0.5),
                body: payload0,
            },
            {
                to: Address.parse(jetton1Wallet),
                value: toNano(0.5),
                body: payload1,
            },
        ]);
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
