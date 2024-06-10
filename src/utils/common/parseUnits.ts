import TonWeb from "tonweb";

const {
    utils: { BN },
} = TonWeb;

export function parseUnits(amount: number, decimals: number): typeof BN {
    return new BN(amount * 10 ** decimals);
}
