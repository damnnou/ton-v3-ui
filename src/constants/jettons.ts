import { AddressType } from "tonweb";

export interface Jetton {
    name: string;
    symbol: string;
    address: AddressType;
    image?: string;
    decimals: number;
}

export type Jettons = {
    [symbol: string]: Jetton;
};

export const jettons: Jettons = {
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
};
