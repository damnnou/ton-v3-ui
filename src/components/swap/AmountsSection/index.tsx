import { useState } from "react";

import TokenSelectMenu from "../TokenSelectMenu";
import { cn } from "../../../lib/cn";
import { MenuState } from "../../../types/token-menu";
import { InputField } from "./InputField";
import { OutputField } from "./OutputField";
import { SwitchButton } from "../../ui/SwitchButton";
import { jettons } from "src/constants/jettons";
import { useExpectedOutputs } from "src/hooks/swap/useExpectedOutputs";
import { useDebounce } from "src/hooks/common/useDebounce";
import { SwapButton } from "../SwapButton";
import { useSwapTonToJettonTxParams } from "src/hooks/swap/useSwapTxParams";
import { fromNano } from "ton-core";

export const AmountsSection = () => {
    const [menuState, setMenuState] = useState<MenuState>(MenuState.CLOSED);

    const [inputValue, setInputValue] = useState<number>(0);

    const debouncedValue = useDebounce(inputValue, 500);

    const inputCurrency = jettons.TON;
    const outputCurrency = jettons.USDT;

    const { expectedOutput, isLoading, protocolFee } = useExpectedOutputs(inputCurrency, outputCurrency, debouncedValue);

    const slippage = 0.01; // 1%
    const minReceivedAmount = expectedOutput && expectedOutput * (1 - slippage);

    const txParams = useSwapTonToJettonTxParams(outputCurrency, minReceivedAmount, debouncedValue);

    const txFee = txParams && fromNano(txParams.gasAmount);

    return (
        <>
            <div
                className={cn(
                    "relative w-full h-fit rounded-2xl transition-all duration-300 bg-light delay-50 overflow-hidden shadow-2xl shadow-purple-500/10 flex flex-col sm:gap-4 gap-2 border-2 border-border-light sm:p-4 sm:rounded-3xl sm:bg-light p-2",
                    menuState === MenuState.CLOSED ? "h-[350px]" : "h-[250px]"
                )}
            >
                {menuState === MenuState.CLOSED && (
                    <>
                        <div className="relative flex flex-col sm:gap-4 gap-2">
                            <InputField
                                disabled={isLoading}
                                onClick={() => setMenuState(MenuState.INPUT)}
                                onChange={setInputValue}
                                selectedToken={inputCurrency}
                                value={inputValue > 0 ? inputValue : undefined}
                            />
                            <OutputField
                                isLoading={isLoading}
                                onClick={() => setMenuState(MenuState.OUTPUT)}
                                selectedToken={outputCurrency}
                                value={expectedOutput}
                            />
                            <SwitchButton
                                onClick={() => null}
                                className="absolute left-1/2 translate-x-[-50%] top-1/2 translate-y-[-50%]"
                            />
                        </div>
                        <SwapButton txParams={txParams} />
                    </>
                )}
                {menuState !== MenuState.CLOSED && (
                    <TokenSelectMenu
                        onSelect={() => null}
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
                            <span>{(slippage * 100).toFixed(2)} %</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Minimum received:</span>
                            <span>
                                {minReceivedAmount.toFixed(4)} {outputCurrency.symbol}
                            </span>
                        </div>
                    </>
                )}
                {txFee && (
                    <div className="flex items-center justify-between">
                        <span>Blockchain fee:</span>
                        <span>0.08 - 0.3 TON</span>
                    </div>
                )}
                {protocolFee && (
                    <div className="flex items-center justify-between">
                        <span>Protocol fee:</span>
                        <span> {protocolFee} TON</span>
                    </div>
                )}
            </div>
        </>
    );
};
