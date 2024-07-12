import { useCallback, useMemo } from "react";
import { POOL } from "src/constants/addresses";
import { jettons } from "src/constants/jettons";
import { useTonConnect } from "src/hooks/common/useTonConnect";
import { useJetton } from "src/hooks/jetton/useJetton";
import { Fraction } from "src/sdk/src/entities/Fraction";
import { Jetton } from "src/sdk/src/entities/Jetton";
import { JettonAmount } from "src/sdk/src/entities/JettonAmount";
import { Percent } from "src/sdk/src/entities/Percent";
import { SwapField, SwapFieldType } from "src/types/swap-field";
import { parseUnits } from "src/utils/common/parseUnits";
import { create } from "zustand";

interface SwapState {
    readonly independentField: SwapFieldType;
    readonly typedValue: string;
    readonly [SwapField.INPUT]: {
        readonly currencyId: string | undefined;
    };
    readonly [SwapField.OUTPUT]: {
        readonly currencyId: string | undefined;
    };
    readonly wasInverted: boolean;
    readonly lastFocusedField: SwapFieldType;
    actions: {
        selectCurrency: (field: SwapFieldType, currencyId: string | undefined) => void;
        switchCurrencies: () => void;
        typeInput: (field: SwapFieldType, typedValue: string) => void;
    };
}

export const useSwapState = create<SwapState>((set, get) => ({
    independentField: SwapField.INPUT,
    typedValue: "",
    [SwapField.INPUT]: {
        currencyId: jettons.ALG_USD.address,
    },
    [SwapField.OUTPUT]: {
        currencyId: jettons.ALG_ETH.address,
    },
    wasInverted: false,
    lastFocusedField: SwapField.INPUT,
    actions: {
        selectCurrency: (field, currencyId) => {
            const otherField = field === SwapField.INPUT ? SwapField.OUTPUT : SwapField.INPUT;

            if (currencyId && currencyId === get()[otherField].currencyId) {
                set({
                    independentField: get().independentField === SwapField.INPUT ? SwapField.OUTPUT : SwapField.INPUT,
                    lastFocusedField: get().independentField === SwapField.INPUT ? SwapField.OUTPUT : SwapField.INPUT,
                    [field]: { currencyId },
                    [otherField]: { currencyId: get()[field].currencyId },
                });
            } else {
                set({
                    [field]: { currencyId },
                });
            }
        },
        switchCurrencies: () =>
            set({
                independentField: get().independentField === SwapField.INPUT ? SwapField.OUTPUT : SwapField.INPUT,
                lastFocusedField: get().independentField === SwapField.INPUT ? SwapField.OUTPUT : SwapField.INPUT,
                [SwapField.INPUT]: { currencyId: get()[SwapField.OUTPUT].currencyId },
                [SwapField.OUTPUT]: { currencyId: get()[SwapField.INPUT].currencyId },
            }),
        typeInput: (field, typedValue) =>
            set({
                independentField: field,
                lastFocusedField: field,
                typedValue,
            }),
    },
}));

export function useSwapActionHandlers(): {
    onCurrencySelection: (field: SwapFieldType, currency: Jetton) => void;
    onSwitchTokens: () => void;
    onUserInput: (field: SwapFieldType, typedValue: string) => void;
} {
    const {
        actions: { selectCurrency, switchCurrencies, typeInput },
    } = useSwapState();

    const onCurrencySelection = useCallback((field: SwapFieldType, currency: Jetton) => selectCurrency(field, currency.address), []);

    const onSwitchTokens = useCallback(() => {
        switchCurrencies();
    }, []);

    const onUserInput = useCallback((field: SwapFieldType, typedValue: string) => {
        typeInput(field, typedValue);
    }, []);

    return {
        onSwitchTokens,
        onCurrencySelection,
        onUserInput,
    };
}

export function tryParseAmount<T extends Jetton>(value?: string, currency?: T): JettonAmount<T> | undefined {
    if (!value || !currency) {
        return undefined;
    }
    try {
        const typedValueParsed = parseUnits(value, currency.decimals).toString();
        if (typedValueParsed !== "0") {
            return JettonAmount.fromRawAmount(currency, typedValueParsed);
        }
    } catch (error) {
        console.debug(`Failed to parse input amount: "${value}"`, error);
    }
    return undefined;
}

export function useDerivedSwapInfo(): {
    currencies: { [field in SwapFieldType]?: Jetton };
    currencyBalances: { [field in SwapFieldType]?: JettonAmount<Jetton> };
    parsedAmount: JettonAmount<Jetton> | undefined;
    parsedAmountOut: JettonAmount<Jetton> | undefined;
    inputError?: string;
    // tradeState: { trade: Trade<Jetton, Jetton, TradeType> | null; state: TradeStateType; fee?: bigint[] | null }
    // toggledTrade: Trade<Jetton, Jetton, TradeType> | undefined
    tickAfterSwap: number | null | undefined;
    allowedSlippage: Percent;
    poolFee: number | undefined;
    tick: number | undefined;
    tickSpacing: number | undefined;
    poolAddress: string | undefined;
    isExactIn: boolean;
} {
    const { wallet: account } = useTonConnect();

    const {
        independentField,
        typedValue,
        [SwapField.INPUT]: { currencyId: inputCurrencyId },
        [SwapField.OUTPUT]: { currencyId: outputCurrencyId },
    } = useSwapState();

    const inputCurrency = useJetton(inputCurrencyId);
    const outputCurrency = useJetton(outputCurrencyId);

    const isExactIn: boolean = independentField === SwapField.INPUT;
    const parsedAmount = useMemo(
        () => tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined),
        [typedValue, isExactIn, inputCurrency, outputCurrency]
    );

    const currentK = 1.013171225937183; // 1000 / 987
    const inverseK = new Fraction(987, 1000);

    const parsedAmountOut = parsedAmount?.multiply(inverseK);

    // const bestTradeExactIn = useBestTradeExactIn(isExactIn ? parsedAmount : undefined, outputCurrency ?? undefined)
    // const bestTradeExactOut = useBestTradeExactOut(inputCurrency ?? undefined, !isExactIn ? parsedAmount : undefined)

    // const trade = (isExactIn ? bestTradeExactIn : bestTradeExactOut) ?? undefined

    const [addressA, addressB] = [inputCurrency?.address || "", outputCurrency?.address || ""];

    /* should polling balances? */
    // const inputCurrencyBalance = useJettonBalance(addressA, account);
    // const outputCurrencyBalance = useJettonBalance(addressB, account);

    const inputCurrencyBalance = undefined;
    const outputCurrencyBalance = undefined;

    const currencyBalances = {
        [SwapField.INPUT]:
            inputCurrency && inputCurrencyBalance ? JettonAmount.fromRawAmount(inputCurrency, inputCurrencyBalance) : undefined,
        [SwapField.OUTPUT]:
            outputCurrency && outputCurrencyBalance ? JettonAmount.fromRawAmount(outputCurrency, outputCurrencyBalance) : undefined,
    };

    const currencies: { [field in SwapFieldType]?: Jetton } = {
        [SwapField.INPUT]: inputCurrency ?? undefined,
        [SwapField.OUTPUT]: outputCurrency ?? undefined,
    };

    let inputError: string | undefined;
    if (!account) {
        inputError = `Connect Wallet`;
    }

    if (!parsedAmount) {
        inputError = inputError ?? `Enter an amount`;
    }

    if (!currencies[SwapField.INPUT] || !currencies[SwapField.OUTPUT]) {
        inputError = inputError ?? `Select a token`;
    }

    // const toggledTrade = trade.trade ?? undefined

    // const tickAfterSwap = trade.priceAfterSwap && TickMath.getTickAtSqrtRatio(JSBI.BigInt(trade.priceAfterSwap[trade.priceAfterSwap.length - 1].toString()))

    // const allowedSlippage = useSwapSlippageTolerance(toggledTrade)

    // const [balanceIn, amountIn] = [currencyBalances[SwapField.INPUT], toggledTrade?.maximumAmountIn(allowedSlippage)]

    // if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    //     inputError = `Insufficient ${amountIn.currency.symbol} balance`
    // }

    // const isWrap = currencies.INPUT && currencies.OUTPUT && currencies.INPUT.wrapped.equals(currencies.OUTPUT.wrapped)

    // const poolAddress = isWrap ? undefined : currencies[SwapField.INPUT] && currencies[SwapField.OUTPUT] && computePoolAddress({
    //     tokenA: currencies[SwapField.INPUT]!.wrapped,
    //     tokenB: currencies[SwapField.OUTPUT]!.wrapped
    // }).toLowerCase() as Address

    const poolAddress = POOL;

    return {
        currencies,
        currencyBalances,
        parsedAmount,
        parsedAmountOut,
        inputError,
        isExactIn,
        // tradeState: trade,
        // toggledTrade,
        // tickAfterSwap,
        // allowedSlippage,
        // poolFee: globalState && globalState[2],
        // tick: globalState && globalState[1],
        // tickSpacing: tickSpacing,
        poolAddress,
    };
}
