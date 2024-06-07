import { jettons } from "src/constants/jettons";
import { AddressType } from "tonweb";

export function isTON(address: AddressType) {
    return address.toString(true) === jettons.TON.address;
}
