import { AddressType } from "@ston-fi/sdk";
import { CHAIN } from "@tonconnect/ui-react";

interface ContractAddress {
    [key: string]: AddressType;
}

export const ROUTER: ContractAddress = {
    [CHAIN.MAINNET]: "EQB3ncyBUTjZUA5EnFKR5_EnOMI9V1tTEAAPaiU71gc4TiUt",
    [CHAIN.TESTNET]: "EQBsGx9ArADUrREB34W-ghgsCgBShvfUr4Jvlu-0KGc33Rbt",
};
