import { jettons } from "src/constants/jettons";
import TonWeb, { AddressType } from "tonweb";

export function isTON(address: AddressType) {
    return new TonWeb.Address(address).toString(false) === new TonWeb.Address(jettons.TON.address).toString(false);
}
