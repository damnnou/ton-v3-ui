import { AbstractJetton } from './AbstractJetton';
import { validateAndParseAddress } from '../utils/validateAndParseAddress';
import { Address } from 'ton-core';
/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
export class Jetton extends AbstractJetton {
  public readonly address: string;

  public constructor(
    address: string,
    decimals: number,
    symbol: string,
    name?: string
  ) {
    super(decimals, symbol, name);
    this.address = validateAndParseAddress(address);
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Jetton): boolean {
    return Address.parse(this.address).equals(Address.parse(other.address));
  }
}
//   /**
//    * Returns true if the address of this token sorts before the address of the other token
//    * @param other other token to compare
//    * @throws if the tokens have the same address
//    * @throws if the tokens are on different chains
//    */
//   public sortsBefore(other: Token): boolean {
//     invariant(this.chainId === other.chainId, 'CHAIN_IDS');
//     invariant(this.address !== other.address, 'ADDRESSES');
//     return this.address.toLowerCase() < other.address.toLowerCase();
//   }

//   /**
//    * Return this token, which does not need to be wrapped
//    */
//   public get wrapped(): Token {
//     return this;
//   }
// }

/**
 * Compares two currencies for equality
 */
export function currencyEquals(jettonA: Jetton, jettonB: Jetton): boolean {
  if (jettonA instanceof Jetton && jettonB instanceof Jetton) {
    return jettonA.equals(jettonB);
  } else if (jettonA instanceof Jetton) {
    return false;
  } else if (jettonB instanceof Jetton) {
    return false;
  } else {
    return jettonA === jettonB;
  }
}
