import Decimal from 'decimal.js'

/**
 * Platform's supported currency codes.
 */
export enum CurrencyCode {
  USD = 'usd',
  SOL = 'sol',
}

/**
 * Represents an amount in both atomic (string) and decimal (number) formats.
 */
export type AmountFormats = {
  /**
   * Original decimal value as string (high precision).
   */
  atomic: string;

  /**
   * The human-readable amount as a number.
   * Use this for UI display.
   */
  decimal: number;
}

const decimalsMap = new Map<CurrencyCode, number>([
  [ CurrencyCode.SOL, 9 ],
  [ CurrencyCode.USD, 0 ],
])

interface AnountFormatOptions {
  currency: CurrencyCode
}

declare module 'decimal.js' {
  interface Decimal {
    toDatabaseFormats(options?: AnountFormatOptions): AmountFormats
    decimalToAtomic(options?: AnountFormatOptions): string
    atomicToDecimal(options?: AnountFormatOptions): number
  }
}

const getDecimalPlacements = (options: AnountFormatOptions): Decimal => {
  const base = new Decimal(10)
  const exponent = decimalsMap.has(options.currency) ? decimalsMap.get(options.currency)! : 0
  
  return base.pow(exponent)
}

Decimal.set({
  precision: 50, // Number of significant digits
  rounding : Decimal.ROUND_FLOOR, // Rounding mode
  toExpNeg : -18, // Exponential notation for small numbers
  toExpPos : 64, // Exponential notation for large numbers
  maxE     : 9e15, // Max exponent
  minE     : -9e15, // Min exponent
  modulo   : Decimal.ROUND_DOWN, // Modulo mode
})

/**
 * Converts a Decimal instance to database-compatible formats.
 *
 * @example
 * new Decimal('123.456').toDatabaseFormats({ currency: CurrencyCode.SOL })
 * // => { atomic: "123456", decimal: 0.000123456 }
 */
Decimal.prototype.toDatabaseFormats = function (options?: AnountFormatOptions) {
  if (!options || options.currency === CurrencyCode.USD) {
    return {
      atomic : this.toString(),
      decimal: this.toNumber(),
    } as AmountFormats
  } else {
    if (!decimalsMap.has(options.currency)) throw new Error(`Currency not supported by database storage algorythm: ${options.currency}`)

    return {
      atomic : this.toString(),
      decimal: this.toNumber() / 10 ** decimalsMap.get(options.currency)!,
    } as AmountFormats
  }
}

/**
 * Converts a human-readable decimal value to its blockchain atomic representation.
 *
 * - For USD, returns the same value as string.
 * - For crypto currencies, multiplies by 10^decimals.
 *
 * @example
 * new Decimal('1').decimalToAtomic({ currency: CurrencyCode.SOL })
 * // => "1000000000"
 */
Decimal.prototype.decimalToAtomic = function (options?: AnountFormatOptions): string {
  if (!options || options.currency === CurrencyCode.USD) return this.toString()

  const placements = getDecimalPlacements(options)

  return this.times(placements).toString()
}

/**
 * Converts a blockchain atomic value to a human-readable decimal.
 *
 * - For USD, returns the same number.
 * - For crypto, divides by 10^decimals.
 *
 * @example
 * new Decimal('1000000000').atomicToDecimal({ currency: CurrencyCode.SOL })
 * // => 1
 */
Decimal.prototype.atomicToDecimal = function (options?: AnountFormatOptions): number {
  if (!options || options.currency === CurrencyCode.USD) return this.toNumber()

  const placements = getDecimalPlacements(options)

  return this.div(placements).toNumber()
}

/**
 * Safely converts a given value to a Decimal instance.
 */
export const toDecimal = (value: Decimal.Value): Decimal => {
  try { return new Decimal(value) } catch { throw new Error('Value not valid number') }
}
