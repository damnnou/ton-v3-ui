import { Jetton } from "src/constants/jettons";

interface SwapInfoProps {
    minReceivedAmount: number | undefined;
    isLoading: boolean;
    slippage: number;
    outputCurrency: Jetton;
    protocolFee: number | undefined;
}

export const SwapInfo = ({ minReceivedAmount, isLoading, slippage, outputCurrency, protocolFee }: SwapInfoProps) => {
    return (
        <div className="w-full mt-6 overflow-hidden flex flex-col empty:hidden gap-2 sm:p-6 p-4 border border-border-light rounded-2xl ">
            {minReceivedAmount && (
                <>
                    <div className="flex items-center justify-between">
                        <span>Slippage tolerance:</span>
                        {isLoading ? (
                            <div className="w-16 h-[24px] bg-light animate-pulse rounded-lg"></div>
                        ) : (
                            <span>{(slippage * 100).toFixed(2)} %</span>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Minimum received:</span>
                        {isLoading ? (
                            <div className="w-24 h-[24px] bg-light animate-pulse rounded-lg"></div>
                        ) : (
                            <span>
                                {minReceivedAmount.toFixed(4)} {outputCurrency.symbol}
                            </span>
                        )}
                    </div>
                </>
            )}
            {protocolFee && (
                <>
                    <div className="flex items-center justify-between">
                        <span>Blockchain fee:</span>
                        {isLoading ? <div className="w-32 h-[24px] bg-light animate-pulse rounded-lg"></div> : <span>0.08 - 0.3 TON</span>}
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Protocol fee:</span>
                        {isLoading ? (
                            <div className="w-40 h-[24px] bg-light animate-pulse rounded-lg"></div>
                        ) : (
                            <span>
                                {protocolFee} {outputCurrency.symbol}
                            </span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
