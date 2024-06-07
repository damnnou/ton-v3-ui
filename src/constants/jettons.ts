import { pTON } from "@ston-fi/sdk";
import TONLogo from "src/assets/jettons/ton.svg";
import NOTLogo from "src/assets/jettons/not.png";
import USDTLogo from "src/assets/jettons/usdt.svg";
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
    NOT: {
        symbol: "NOT",
        address: "EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT",
        logo: NOTLogo,
        decimals: 9,
    },
};
