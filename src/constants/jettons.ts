import TONLogo from "src/assets/jettons/ton.svg";
import USDTLogo from "src/assets/jettons/usdt.svg";
import NOTLogo from "src/assets/jettons/not.png";
import SKATELogo from "src/assets/jettons/skate.png";
import ALGBLogo from "src/assets/algebra-logo.svg";
import { AddressType } from "tonweb";
import { CHAIN } from "@tonconnect/ui-react";
import { pTON } from "@ston-fi/sdk";

export interface Jetton {
    symbol: string;
    address: AddressType;
    logo: string;
    decimals: number;
}

export const jettons = {
    [CHAIN.MAINNET]: {
        TON: {
            symbol: "TON",
            address: pTON.v1.address.toString(true),
            logo: TONLogo,
            decimals: 9,
        },
        USDT: {
            symbol: "USDT",
            address: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
            logo: USDTLogo,
            decimals: 6,
        },
        NOT: {
            symbol: "NOT",
            address: "EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT",
            logo: NOTLogo,
            decimals: 9,
        },
    },
    [CHAIN.TESTNET]: {
        TON: {
            symbol: "TON",
            address: "kQAcOvXSnnOhCdLYc6up2ECYwtNNTzlmOlidBeCs5cFPV7AM",
            logo: TONLogo,
            decimals: 9,
        },
        USDT: {
            symbol: "USDT",
            address: "kQBmksCKED7t6zEsOE_MDGCwPuWxHQoVolut6pG0cF6m8hDF",
            logo: USDTLogo,
            decimals: 9,
        },
        tSTON: {
            symbol: "tSTON",
            address: "kQCH-yP4S3nA_j7K7EIV1QIhVTWMyNJfxeYzacUH76ks2q6P",
            logo: ALGBLogo,
            decimals: 9,
        },
        SKATE: {
            symbol: "SKATE",
            address: "EQAI2_tWxzHj_u5b-ujdnC3-Yd1XFriS71mLhS3E8jpYeEhR",
            logo: SKATELogo,
            decimals: 9,
        },
    },
};
