import { useEffect, useState } from "react";
import { cn } from "src/lib/cn";
import { MenuState } from "src/types/token-menu";
import { ActionButton, SwitchButton } from "../../ui/Button";
import { Jetton } from "src/constants/jettons";
import { useDebounce } from "src/hooks/common/useDebounce";
import { useTonConnect } from "src/hooks/common/useTonConnect";
import { CHAIN } from "@tonconnect/ui-react";
import { useTokensState } from "src/state/tokensStore";
import TokenSelectMenu from "src/components/swap/TokenSelectMenu";
import { InputField } from "src/components/swap/AmountsSection/InputField";
import { OutputField } from "src/components/swap/AmountsSection/OutputField";
import { useProvideLiquidityTxParams } from "src/hooks/pool/useProvideLiquidityTxParams";
import { useSendTransaction } from "src/hooks/common/useSendTransaction";
import { Spinner } from "src/components/ui/Spinner";
import { usePoolByTokens } from "src/hooks/pool/usePool";
import { formatUnits } from "src/utils/common/formatUnits";

export const CreatePoolForm = () => {
    const [menuState, setMenuState] = useState<MenuState>(MenuState.CLOSED);

    const { network } = useTonConnect();

    const { importedTokens } = useTokensState();

    const [inputCurrency, setInputCurrency] = useState<Jetton>(importedTokens[network || CHAIN.MAINNET].TON);
    const [outputCurrency, setOutputCurrency] = useState<Jetton>(importedTokens[network || CHAIN.MAINNET].USDT);

    const [inputValue, setInputValue] = useState<number>(0);

    const debouncedValue = useDebounce(inputValue, 300);

    const minDecimals = Math.min(inputCurrency.decimals, outputCurrency.decimals);
    const minAmount = formatUnits(1001, minDecimals);

    const minOfferAmount = debouncedValue > 1 ? minAmount * debouncedValue : minAmount;
    const minAskAmount = debouncedValue > 1 || !debouncedValue ? minAmount : minAmount / debouncedValue;

    const pool = usePoolByTokens({ token0: inputCurrency.address, token1: outputCurrency.address });

    const txsParams = useProvideLiquidityTxParams({
        offerJetton: inputCurrency,
        askJetton: outputCurrency,
        offerAmount: minOfferAmount,
        minAskAmount: minAskAmount,
    });

    const { write, isLoading: isProviding } = useSendTransaction(txsParams);

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
                            <OutputField onClick={() => setMenuState(MenuState.OUTPUT)} selectedToken={outputCurrency} value={1} />
                            <SwitchButton
                                onClick={() => {
                                    setInputCurrency(outputCurrency);
                                    setOutputCurrency(inputCurrency);
                                }}
                                className="absolute left-1/2 translate-x-[-50%] top-1/2 translate-y-[-50%]"
                            />
                        </div>
                        <ActionButton
                            onClick={write}
                            disabled={isProviding || !write || Boolean(pool || pool === undefined) || !debouncedValue}
                        >
                            {isProviding ? (
                                <Spinner className="w-12 h-12" />
                            ) : pool ? (
                                "Pool already exists"
                            ) : !debouncedValue ? (
                                "Enter an amount"
                            ) : pool === null ? (
                                "Create pool"
                            ) : (
                                <Spinner className="w-12 h-12" />
                            )}
                        </ActionButton>
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
            {Boolean(debouncedValue && txsParams && pool === null) && (
                <div className="w-full mt-6 overflow-hidden flex flex-col empty:hidden gap-2 sm:p-6 p-4 border border-border-light rounded-2xl animate-fade-in">
                    <div className="flex items-center justify-between">
                        <span>{inputCurrency.symbol} price:</span>
                        <span>
                            {minAskAmount / minOfferAmount} {outputCurrency.symbol}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>{outputCurrency.symbol} price:</span>
                        <span>
                            {minOfferAmount / minAskAmount} {inputCurrency.symbol}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Min {inputCurrency.symbol}:</span>
                        <span>{minOfferAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Min {outputCurrency.symbol}:</span>
                        <span>{minAskAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Blockchain fee:</span>
                        <span>0.3 - 1.6 TON</span>
                    </div>
                </div>
            )}
        </>
    );
};
