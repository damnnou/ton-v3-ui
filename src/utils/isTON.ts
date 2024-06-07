import { jettons } from "src/constants/jettons";
import { AddressType } from "tonweb";

export function isTON(address: AddressType) {
    return address.toString() === jettons.TON.address.toString();
}
