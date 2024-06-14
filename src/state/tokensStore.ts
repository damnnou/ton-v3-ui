import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import deepMerge from "lodash.merge";
import { CHAIN } from "@tonconnect/ui-react";
import { Jetton, jettons, Jettons } from "src/constants/jettons";

interface TokensState {
    importedTokens: Jettons;
    actions: {
        importToken: (jetton: Jetton, chain: CHAIN) => void;
    };
}

export const useTokensState = create(
    persist<TokensState>(
        (set, get) => ({
            importedTokens: jettons,
            actions: {
                importToken: (jetton, chain) => {
                    const { importedTokens } = get();
                    set({
                        importedTokens: {
                            ...importedTokens,
                            [chain]: {
                                ...importedTokens[chain],
                                [jetton.symbol]: jetton,
                            },
                        },
                    });
                },
            },
        }),
        {
            name: "tokens-storage",
            storage: createJSONStorage(() => localStorage),
            merge: (persistedState, currentState) => deepMerge(currentState, persistedState),
        }
    )
);
