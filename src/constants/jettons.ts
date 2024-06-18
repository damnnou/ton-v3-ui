import { AddressType } from "tonweb";
import { CHAIN } from "@tonconnect/ui-react";
import { pTON } from "@ston-fi/sdk";

export interface Jetton {
    name: string;
    symbol: string;
    address: AddressType;
    image?: string;
    decimals: number;
}

export type Jettons = {
    [chain in CHAIN]: {
        [symbol: string]: Jetton;
    };
};

export const jettons: Jettons = {
    [CHAIN.MAINNET]: {
        TON: {
            name: "TON",
            symbol: "TON",
            address: pTON.v1.address.toString(true),
            image: "https://cache.tonapi.io/imgproxy/X7T-fLahBBVIxXacXAqrsCHIgFgTQE3Jt2HAdnc5_Mc/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zdGF0aWMuc3Rvbi5maS9sb2dvL3Rvbl9zeW1ib2wucG5n.webp",
            decimals: 9,
        },
        USDT: {
            name: "Tether USD",
            symbol: "USDT",
            address: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
            image: "https://cache.tonapi.io/imgproxy/T3PB4s7oprNVaJkwqbGg54nexKE0zzKhcrPv8jcWYzU/rs:fill:200:200:1/g:no/aHR0cHM6Ly90ZXRoZXIudG8vaW1hZ2VzL2xvZ29DaXJjbGUucG5n.webp",
            decimals: 6,
        },
        NOT: {
            name: "Notcoin",
            symbol: "NOT",
            address: "EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT",
            image: "https://cache.tonapi.io/imgproxy/4KCMNm34jZLXt0rqeFm4rH-BK4FoK76EVX9r0cCIGDg/rs:fill:200:200:1/g:no/aHR0cHM6Ly9jZG4uam9pbmNvbW11bml0eS54eXovY2xpY2tlci9ub3RfbG9nby5wbmc.webp",
            decimals: 9,
        },
    },
    [CHAIN.TESTNET]: {
        TON: {
            name: "TON",
            symbol: "TON",
            address: "kQAcOvXSnnOhCdLYc6up2ECYwtNNTzlmOlidBeCs5cFPV7AM",
            image: "https://cache.tonapi.io/imgproxy/X7T-fLahBBVIxXacXAqrsCHIgFgTQE3Jt2HAdnc5_Mc/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zdGF0aWMuc3Rvbi5maS9sb2dvL3Rvbl9zeW1ib2wucG5n.webp",
            decimals: 9,
        },
        USDT: {
            name: "Tether USD",
            symbol: "USDT",
            address: "kQDy_cw29BM7O2tb4r4178LGWELtKzb9Xv4Fs3C005u9Sv55",
            image: "https://cache.tonapi.io/imgproxy/T3PB4s7oprNVaJkwqbGg54nexKE0zzKhcrPv8jcWYzU/rs:fill:200:200:1/g:no/aHR0cHM6Ly90ZXRoZXIudG8vaW1hZ2VzL2xvZ29DaXJjbGUucG5n.webp",
            decimals: 6,
        },
        SKATE: {
            name: "SKATE",
            symbol: "SKATE",
            address: "EQBptrMzgf7A2IqEDwC6afTQ0faWVndPzH9-aZuugxLzOqNW",
            image: "https://cache.tonapi.io/imgproxy/v1LRvf3pIQp6DEz-Itr8EH9zVsEI93LQKXejlkSH4kM/rs:fill:200:200:1/g:no/aHR0cHM6Ly9pLnBvc3RpbWcuY2MvR21xOXdic3QvbG9nby5wbmc.webp",
            decimals: 18,
        },
    },
};
