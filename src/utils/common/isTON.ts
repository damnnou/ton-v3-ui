import { CHAIN } from "@tonconnect/ui-react";
import { jettons } from "src/constants/jettons";
import { AddressType } from "tonweb";

export function isTON(address: AddressType, network: CHAIN) {
    return address.toString() === jettons[network].TON.address.toString();
}
