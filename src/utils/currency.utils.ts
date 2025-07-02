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
 * Metadata for each currency.
 */
type CurrencyInfo = {
  code: CurrencyCode;
  decimals: number;
  name: string;
  category: CurrencyCategory;
};

type AmountType = string | number | bigint

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

/**
 * Map of Platform currency metadata used for conversions.
 */
const currencyMap: Map<CurrencyCode, CurrencyInfo> = new Map([
  [ CurrencyCode.USD, { code: CurrencyCode.USD, decimals: 4, name: 'US Dollar', category: CurrencyCategory.Fiat } ],
  [ CurrencyCode.SOL, { code:  CurrencyCode.SOL, decimals: 9, name: 'Solana', category:  CurrencyCategory.Crypto } ],
])

/**
 * A class to handle precise arithmetic and formatting of currency values.
 * Supports fiat and crypto currencies, internal atomic unit conversion,
 * and user-facing decimal formatting.
 *
 *@example
 *  // Create a new CurrencyAmount for USD
 *  const amt = new CurrencyAmount('1.23', 'USD');
 *  console.log(amt);
 */
class CurrencyAmount {
  private amount: bigint
  private readonly currency: CurrencyInfo

  /**
   * Creates a new CurrencyAmount instance.
   *
   * @param input - Amount in decimal or atomic format.
   * @param code - Currency code for this amount.
   */
  constructor(input: AmountType, code: CurrencyCode) {
    const currency = currencyMap.get(code)

    if (!currency) throw new Error('Invalid currency code')

    this.currency = currency
    this.amount = this.parseInput(input)
  }

  /**
   * Converts an amount to its internal atomic representation.
   *
   * @param value - Input value in decimal or atomic format.
   *
   * @example
   *  // For a currency with 2 decimals, '1.23' becomes 123n
   *  const atomic = this.parseInput('1.23', 2);
   *  console.log(atomic); // 123n
   */
  private parseInput(value: string | number | bigint): bigint {
    if (typeof value === 'bigint') return value

    let num = (typeof value === 'number') ? value.toString() : value
    const decimals = this.currency.decimals

    // if it is fiat and there is no decimal point → 10 → "10.00" (for 2 digits)
    if (this.currency.category === CurrencyCategory.Fiat && !num.includes('.')) {
      num = num + '.' + '0'.repeat(decimals)
    }

    const [ intPart, fracPart = '' ] = num.split('.')
    const padded = fracPart.padEnd(decimals, '0').slice(0, decimals)
    
    return BigInt(intPart + padded)
  }

  /**
   * Formats the internal atomic amount into a user-facing decimal number.
   *
   * @param value - Internal bigint amount.
   *
   * @example
   *  // For a currency with 2 decimals, 123n becomes 1.23
   *  const human = this.formatHuman(123n, 2);
   *  console.log(human); // 1.23
   */
  private formatHuman(value: bigint): number {
    const decimals = this.currency.decimals
    const str = value.toString().padStart(decimals + 1, '0')
    const intPart = str.slice(0, -decimals) || '0'
    const fracPart = str.slice(-decimals)
    
    return parseFloat(`${intPart}.${fracPart}`)
  }

  /**
   * Adds the given value to the current amount.
   *
   * @param value - Value to add.
   * @returns The current instance for chaining.
   *
   * @example
   * const amt = new CurrencyAmount('1.00', 'USD');
   * amt.add('0.50'); // now amt represents 1.50 USD
   */
  add(value: string | number | bigint): CurrencyAmount {
    const addAmount = this.parseInput(value)
    this.amount += addAmount
    
    return this
  }

  /**
   * Subtracts the given value from the current amount.
   * Replaces current amount by new decreased amount.
   *
   * @param value - Value to subtract.
   * @returns The current instance for chaining.
   *
   * @example
   * const amt = new CurrencyAmount('2.00', 'USD');
   * amt.subtract(0.75); // now amt represents 1.25 USD
   */
  subtract(value: string | number | bigint): CurrencyAmount {
    const subAmount = this.parseInput(value)
    this.amount -= subAmount
    
    return this
  }

  /**
   * Multiplies the current amount by a number.
   * @param factor - Multiplier.
   * @returns The current instance for chaining.
   */
  multiply(factor: number): CurrencyAmount {
    const result = BigInt(Math.round(Number(this.amount) * factor))
    this.amount = result
    
    return this
  }

  /**
   * Divides the current amount by a number.
   * @param divisor - Divisor.
   * @returns The current instance for chaining.
   */
  divide(divisor: number): CurrencyAmount {
    const result = BigInt(Math.round(Number(this.amount) / divisor))
    this.amount = result
    
    return this
  }

  /**
   * Checks if the current amount is less than the given value.
   * @param value - Value to compare.
   * @returns True if less than the input.
   */
  lt(value: string | number | bigint): boolean {
    const compare = this.parseInput(value)
    
    return this.amount < compare
  }

  /**
   * Checks if the current amount is less than or equal to the given value.
   * @param value - Value to compare.
   * @returns True if less than or equal.
   */
  lte(value: string | number | bigint): boolean {
    const compare = this.parseInput(value)
    
    return this.amount <= compare
  }

  /**
   * Checks if the current amount is greater than the given value.
   * @param value - Value to compare.
   * @returns True if greater than.
   */
  gt(value: string | number | bigint): boolean {
    const compare = this.parseInput(value)
    
    return this.amount > compare
  }

  /**
   * Checks if the current amount is greater than or equal to the given value.
   * @param value - Amount to compare.
   * @returns True if greater than or equal.
   */
  gte(value: string | number | bigint): boolean {
    const compare = this.parseInput(value)
    
    return this.amount >= compare
  }

  /**
   * Checks if the current amount is positive (> 0).
   *
   * @returns true if amount > 0, otherwise false
   *
   * @example
   * this.amount = 10n;
   * this.isPositive(); // true
   *
   * @example
   * this.amount = 0n;
   * this.isPositive(); // false
   */
  isPositive(): boolean {
    return this.amount > 0n
  }

  /**
   * Converts the internal atomic amount to a user-friendly decimal format.
   * Use this for UI display.
   * @returns A number representing the currency amount in decimal form.
   */
  toDecimal(): number {
    return this.formatHuman(this.amount)
  }

  /**
   * Returns the internal atomic amount as a string.
   * Use this for storing in databases or sending to smart contracts.
   * @returns A string of the atomic currency amount.
   */
  toAtomic(): string {
    return this.amount.toString()
  }

  /**
   * Returns both the internal atomic amount and the user-friendly decimal amount.
   *
   * @returns An object containing:
   *  - `atomic`: the raw atomic amount as a string
   *  - `decimal`: the human-readable amount as a number
   *
   * @example
   * const amt = new CurrencyAmount('1.23', 'USD');
   * const formatted = amt.toFormats();
   * // formatted.atomic === '123'
   * // formatted.decimal === 1.23
   */
  toFormats(): AmountFormats {
    return {
      atomic: this.toAtomic(),
      decimal: this.toDecimal(),
    }
  }
}

/**
 * Factory function to create a CurrencyAmount instance.
 *
 * @param input - Input amount in decimal or atomic format.
 * @param currencyCode - Code of the currency to use.
 * @returns A new CurrencyAmount instance.
 *
 * @example
 * const amt = currencyAmount('10.00', 'USD');
 * console.log(amt);
 */
export const currencyAmount = (input: AmountType, currencyCode: CurrencyCode): CurrencyAmount => {
  return new CurrencyAmount(input, currencyCode)
}
