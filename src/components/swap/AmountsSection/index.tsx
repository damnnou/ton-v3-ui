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

export const AmountsSection = () => {
    const [menuState, setMenuState] = useState<MenuState>(MenuState.CLOSED);

    const [inputValue, setInputValue] = useState<number>(0);

    const debouncedValue = useDebounce(inputValue, 500);

    const inputCurrency = jettons.TON;
    const outputCurrency = jettons.USDT;

    const { expectedOutput, isLoading } = useExpectedOutputs(inputCurrency, outputCurrency, debouncedValue);

    return (
        <>
            <div
                className={cn(
                    "relative w-full transition-all duration-300 delay-50 overflow-hidden shadow-2xl sm:shadow-purple-500/30 flex flex-col gap-4 sm:border-2 sm:border-border-light sm:p-4 sm:rounded-3xl sm:bg-light p-0 bg-transparent",
                    menuState === MenuState.CLOSED ? "h-[350px]" : "h-[250px]"
                )}
            >
                {menuState === MenuState.CLOSED && (
                    <>
                        <div className="relative flex flex-col gap-4">
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
                        <SwapButton />
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
        </>
    );
};
