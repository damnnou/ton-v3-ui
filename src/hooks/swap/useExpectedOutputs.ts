import { BN } from "@ston-fi/sdk";
import { usePoolContract } from "../contracts/usePoolContract";
import { useJettonWalletAddress } from "../jetton/useJettonWalletAddress";
import { ROUTER } from "src/constants/addresses";
import { usePoolAddress } from "../pool/usePoolAddress";
import { useEffect, useState } from "react";
import { Jetton } from "src/constants/jettons";
import { formatUnits } from "src/utils/formatUnits";
import { useTonConnect } from "../common/useTonConnect";
import { CHAIN } from "@tonconnect/ui-react";

interface ExpectedOutputs {
    jettonToReceive: BN;
    protocolFeePaid: BN;
    refFeePaid: BN;
}

export function useExpectedOutputs(
    tokenIn: Jetton,
    tokenOut: Jetton,
    amount: number
): {
    expectedOutput: number | undefined;
    isLoading: boolean;
    protocolFee: number | undefined;
} {
    const [outputs, setOutputs] = useState<ExpectedOutputs>();
    const [isLoading, setIsLoading] = useState(false);

    const { network } = useTonConnect();

    const jetton0WalletAddress = useJettonWalletAddress({ jettonAddress: tokenIn.address, ownerAddress: ROUTER[network || CHAIN.MAINNET] });
    const jetton1WalletAddress = useJettonWalletAddress({
        jettonAddress: tokenOut.address,
        ownerAddress: ROUTER[network || CHAIN.MAINNET],
    });

    useEffect(() => {
        if (!jetton0WalletAddress || !jetton1WalletAddress) return;
        console.log("Router's jetton wallets: ");
        console.log(tokenIn.symbol, " - ", jetton0WalletAddress?.toString(true));
        console.log(tokenOut.symbol, " - ", jetton1WalletAddress?.toString(true));
    }, [jetton0WalletAddress, jetton1WalletAddress]);

    const poolAddress = usePoolAddress({ token0: jetton0WalletAddress, token1: jetton1WalletAddress });

    const pool = usePoolContract(poolAddress);

    useEffect(() => {
        if (!pool || !jetton0WalletAddress || !amount) return;
        setIsLoading(true);

        const timeout = setInterval(() => {
            pool.getExpectedOutputs({ jettonWallet: jetton0WalletAddress, amount: amount * 10 ** tokenIn.decimals })
                .then(setOutputs)
                .catch(() => setOutputs(undefined))
                .finally(() => setIsLoading(false));
        }, 5000);

        return () => clearTimeout(timeout);
    }, [pool, amount, jetton0WalletAddress, tokenIn.decimals]);

    if (!outputs) {
        return {
            expectedOutput: undefined,
            protocolFee: undefined,
            isLoading,
        };
    } else if (!amount) {
        return {
            expectedOutput: undefined,
            protocolFee: undefined,
            isLoading: false,
        };
    }

    return {
        expectedOutput: formatUnits(outputs.jettonToReceive, tokenOut.decimals),
        protocolFee: formatUnits(outputs.protocolFeePaid, tokenOut.decimals),
        isLoading,
    };
}
