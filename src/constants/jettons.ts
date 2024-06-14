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
            image: "https://cache.tonapi.io/imgproxy/Az2gjbWFgs5Oy-cSWnMocj3RNufMUFdaz1rBBmyf4ag/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zMi5jb2lubWFya2V0Y2FwLmNvbS9zdGF0aWMvaW1nL2NvaW5zLzY0eDY0LzgyNS5wbmc.webp",
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
            address: "kQBmksCKED7t6zEsOE_MDGCwPuWxHQoVolut6pG0cF6m8hDF",
            image: "https://cache.tonapi.io/imgproxy/Az2gjbWFgs5Oy-cSWnMocj3RNufMUFdaz1rBBmyf4ag/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zMi5jb2lubWFya2V0Y2FwLmNvbS9zdGF0aWMvaW1nL2NvaW5zLzY0eDY0LzgyNS5wbmc.webp",
            decimals: 9,
        },
        tSTON: {
            name: "tSTON",
            symbol: "tSTON",
            address: "kQCH-yP4S3nA_j7K7EIV1QIhVTWMyNJfxeYzacUH76ks2q6P",
            image: "https://cache.tonapi.io/imgproxy/ig5IfnaDFWaPkqP_I6QuyQhRouy8OMnLyCvE2FutgMo/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zdC50b25veC5vcmcvMS5wbmc.webp",
            decimals: 9,
        },
        SKATE: {
            name: "SKATE",
            symbol: "SKATE",
            address: "EQAI2_tWxzHj_u5b-ujdnC3-Yd1XFriS71mLhS3E8jpYeEhR",
            image: "https://cache.tonapi.io/imgproxy/Czn0LmpeHRodKq9xf-toVTQ4k0leDC-aeRri7S0x07s/rs:fill:200:200:1/g:no/aHR0cHM6Ly9pLnBvc3RpbWcuY2MvUlpNeWRqcm4vYXNkLnBuZw.webp",
            decimals: 9,
        },
    },
};
