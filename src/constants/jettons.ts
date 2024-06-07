import TONLogo from "src/assets/jettons/ton.svg";
import USDTLogo from "src/assets/jettons/usdt.svg";
import ALGBLogo from "src/assets/algebra-logo.svg";
import { AddressType } from "tonweb";
import { pTON } from "@skdamn/ton-sdk";

export interface Jetton {
    symbol: string;
    address: AddressType;
    logo: string;
    decimals: number;
}

// TESTNET
export const jettons = {
    TON: {
        symbol: "TON",
        address: pTON.v1.address,
        logo: TONLogo,
        decimals: 9,
    },
    jUSDT: {
        symbol: "jUSDT",
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
    UKWN: {
        symbol: "UKWN",
        address: "kQBTUimnbIuh8gZRvuDMHiRUG0x3-sErqJTy9Qit74RBQkqQ",
        logo: ALGBLogo,
        decimals: 9,
    },
};
