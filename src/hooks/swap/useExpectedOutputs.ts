import { BN } from "@ston-fi/sdk";
import { usePoolContract } from "../contracts/usePoolContract";
import { useJettonWalletAddress } from "../jetton/useJettonWalletAddress";
import { ROUTER } from "src/constants/addresses";
import { usePoolByTokens } from "../pool/usePool";
import { useEffect, useState } from "react";
import { Jetton } from "src/constants/jettons";
import { formatUnits } from "src/utils/common/formatUnits";
import { parseUnits } from "src/utils/common/parseUnits";

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

    const jetton0WalletAddress = useJettonWalletAddress({ jettonAddress: tokenIn.address, ownerAddress: ROUTER });

    const poolData = usePoolByTokens({ token0: tokenIn.address, token1: tokenOut.address });

    const pool = usePoolContract(poolData?.address);

    useEffect(() => {
        if (!pool || !jetton0WalletAddress || !amount) return;
        setIsLoading(true);

        const timeout = setInterval(() => {
            pool.getExpectedOutputs({ jettonWallet: jetton0WalletAddress, amount: parseUnits(amount, tokenIn.decimals) })
                .then(setOutputs)
                .catch(() => setOutputs(undefined))
                .finally(() => setIsLoading(false));
        }, 5000);

        return () => clearTimeout(timeout);
    }, [pool, amount, jetton0WalletAddress, tokenIn.decimals, tokenIn.address]);

    if (!outputs) {
        return {
            expectedOutput: undefined,
            protocolFee: undefined,
            isLoading,
        };
    } else if (!amount || !poolData) {
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
