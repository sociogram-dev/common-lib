/**
 * Platform's supported currency codes.
 */
export enum CurrencyCode {
  USD = 'usd',
  SOL = 'sol',
}

/**
 * Category of a currency, used to distinguish fiat vs. cryptocurrency.
 */
enum CurrencyCategory {
  Fiat = 'fiat',
  Crypto = 'crypto',
}

/**
 * Represents an amount in both atomic (string) and decimal (number) formats.
 */
export type AmountFormats = {
  /**
   * The internal atomic amount as a string.
   * Use this for precise calculations or storing on-chain.
   */
  atomic: string;

  /**
   * The human-readable amount as a number.
   * Use this for UI display.
   */
  decimal: number;
}
