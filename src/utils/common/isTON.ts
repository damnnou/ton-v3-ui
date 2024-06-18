import { CHAIN } from "@tonconnect/ui-react";
import { jettons } from "src/constants/jettons";
import TonWeb, { AddressType } from "tonweb";

export function isTON(address: AddressType, network: CHAIN) {
    return new TonWeb.Address(address).toString(false) === new TonWeb.Address(jettons[network].TON.address).toString(false);
}
