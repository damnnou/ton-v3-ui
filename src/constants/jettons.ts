import { pTON } from "@ston-fi/sdk";
import TONLogo from "src/assets/tokens/ton.svg";
import USDTLogo from "src/assets/tokens/usdt.svg";
import { AddressType } from "tonweb";

export interface Jetton {
    symbol: string;
    address: AddressType;
    logo: string;
    decimals: number;
}

export const jettons = {
    TON: {
        symbol: "TON",
        address: pTON.v1.address.toString(),
        logo: TONLogo,
        decimals: 9,
    },
    USDT: {
        symbol: "USDT",
        address: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
        logo: USDTLogo,
        decimals: 6,
    },
};
