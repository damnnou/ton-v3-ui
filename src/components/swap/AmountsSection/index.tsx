import { useEffect, useState } from "react";
import TokenSelectMenu from "../TokenSelectMenu";
import { cn } from "src/lib/cn";
import { MenuState } from "src/types/token-menu";
import { InputField } from "./InputField";
import { OutputField } from "./OutputField";
import { SwitchButton } from "../../ui/Button";
import { Jetton } from "src/constants/jettons";
import { useExpectedOutputs } from "src/hooks/swap/useExpectedOutputs";
import { useDebounce } from "src/hooks/common/useDebounce";
import { SwapButton } from "../SwapButton";
import { useSwapTxParams } from "src/hooks/swap/useSwapTxParams";
import { useTonConnect } from "src/hooks/common/useTonConnect";
import { CHAIN } from "@tonconnect/ui-react";
import { SwapInfo } from "../SwapParams";
import { useTokensState } from "src/state/tokensStore";

export const AmountsSection = () => {
    const [menuState, setMenuState] = useState<MenuState>(MenuState.CLOSED);

    const { network } = useTonConnect();

    const { importedTokens } = useTokensState();

    const [inputCurrency, setInputCurrency] = useState<Jetton>(importedTokens[network || CHAIN.MAINNET].TON);
    const [outputCurrency, setOutputCurrency] = useState<Jetton>(importedTokens[network || CHAIN.MAINNET].USDT);

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

    useEffect(() => {
        if (!network) return;
        setInputCurrency(importedTokens[network].TON);
        setOutputCurrency(importedTokens[network].USDT);
    }, [network, importedTokens]);

    return (
        <>
            <div
                className={cn(
                    "relative w-full rounded-2xl transition-all duration-300 bg-light delay-50 overflow-hidden shadow-2xl shadow-purple-500/10 flex flex-col sm:gap-4 gap-2 border-2 border-border-light sm:p-4 sm:rounded-3xl sm:bg-light p-2",
                    menuState === MenuState.CLOSED ? "h-[318px] sm:h-[350px]" : "h-[600px]"
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
                                    setInputValue(expectedOutput || 0);
                                    setInputCurrency(outputCurrency);
                                    setOutputCurrency(inputCurrency);
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
            <SwapInfo
                outputCurrency={outputCurrency}
                isLoading={isLoading}
                minReceivedAmount={minReceivedAmount}
                protocolFee={protocolFee}
                slippage={slippage}
            />
        </>
    );
};
