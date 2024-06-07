import { useState } from "react";
import TokenSelectMenu from "../TokenSelectMenu";
import { cn } from "../../../lib/cn";
import { MenuState } from "../../../types/token-menu";
import { InputField } from "./InputField";
import { OutputField } from "./OutputField";
import { SwitchButton } from "../../ui/SwitchButton";
import { Jetton, jettons } from "src/constants/jettons";
import { useExpectedOutputs } from "src/hooks/swap/useExpectedOutputs";
import { useDebounce } from "src/hooks/common/useDebounce";
import { SwapButton } from "../SwapButton";
import { fromNano } from "ton-core";
import { useSwapTxParams } from "src/hooks/swap/useSwapTxParams";

export const AmountsSection = () => {
    const [menuState, setMenuState] = useState<MenuState>(MenuState.CLOSED);

    const [inputCurrency, setInputCurrency] = useState<Jetton>(jettons.TON);
    const [outputCurrency, setOutputCurrency] = useState<Jetton>(jettons.USDT);

    const [inputValue, setInputValue] = useState<number>(0);

    const debouncedValue = useDebounce(inputValue, 300);

    const { expectedOutput, isLoading, protocolFee } = useExpectedOutputs(inputCurrency, outputCurrency, debouncedValue);

    const slippage = 0.01; // 1%
    const minReceivedAmount = expectedOutput && expectedOutput * (1 - slippage);

    const txParams = useSwapTxParams({
        offerJetton: inputCurrency,
        askJetton: outputCurrency,
        offerAmount: debouncedValue,
        minAskAmount: minReceivedAmount,
    });

    const txFee = txParams && fromNano(txParams.gasAmount);

    return (
        <>
            <div
                className={cn(
                    "relative w-full rounded-2xl transition-all duration-300 bg-light delay-50 overflow-hidden shadow-2xl shadow-purple-500/10 flex flex-col sm:gap-4 gap-2 border-2 border-border-light sm:p-4 sm:rounded-3xl sm:bg-light p-2",
                    menuState === MenuState.CLOSED ? "h-[318px] sm:h-[350px]" : "h-[450px]"
                )}
            >
                {menuState === MenuState.CLOSED && (
                    <>
                        <div className="relative flex flex-col sm:gap-4 gap-2">
                            <InputField
                                onClick={() => setMenuState(MenuState.INPUT)}
                                onChange={setInputValue}
                                selectedToken={inputCurrency}
                                value={inputValue > 0 ? inputValue : undefined}
                            />
                            <OutputField
                                onClick={() => setMenuState(MenuState.OUTPUT)}
                                selectedToken={outputCurrency}
                                value={expectedOutput}
                            />
                            <SwitchButton
                                onClick={() => {
                                    if (isLoading) return;
                                    const tempInputCurr = inputCurrency;
                                    setInputValue(expectedOutput || 0);
                                    setInputCurrency(outputCurrency);
                                    setOutputCurrency(tempInputCurr);
                                }}
                                className="absolute left-1/2 translate-x-[-50%] top-1/2 translate-y-[-50%]"
                            />
                        </div>
                        <SwapButton disabled={isLoading} txParams={txParams} />
                    </>
                )}
                {menuState !== MenuState.CLOSED && (
                    <TokenSelectMenu
                        onSelect={menuState === MenuState.INPUT ? setInputCurrency : setOutputCurrency}
                        onClick={setMenuState}
                        selectedToken={menuState === MenuState.INPUT ? outputCurrency : inputCurrency}
                    />
                )}
            </div>
            <div className="relative w-full mt-6 overflow-hidden flex flex-col empty:hidden gap-2 sm:p-6 p-4 border border-border-light rounded-2xl ">
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
                {txFee && (
                    <div className="flex items-center justify-between">
                        <span>Blockchain fee:</span>
                        {isLoading ? <div className="w-32 h-[24px] bg-light animate-pulse rounded-lg"></div> : <span>0.08 - 0.3 TON</span>}
                    </div>
                )}
                {protocolFee && (
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
                )}
            </div>
        </>
    );
};
