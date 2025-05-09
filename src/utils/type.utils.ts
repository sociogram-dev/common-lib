/**
 * Utility type that allows a value of type `T` or `null`.
 *
 * Useful for optional fields where `undefined` is not expected.
 *
 * @example
 * const name: Nullable<string> = null;
 */
export type Nullable<T> = T | null;

/**
 * Nullable version of the `string` type.
 *
 * @example
 * const username: NullableString = 'Alice';
 * const nickname: NullableString = null;
 */
export type NullableString = string | null;

/**
 * Nullable version of the `number` type.
 *
 * @example
 * const age: NullableNumber = 30;
 * const optionalScore: NullableNumber = null;
 */
export type NullableNumber = number | null;

/**
 * A flexible type used to describe TypeScript enums at runtime.
 *
 * Supports both:
 * - regular enum values (string[] | number[])
 * - mixed enums
 * - reverse-mapped numeric enums (Record<number, string>)
 *
 * Useful for enum utilities like `getEnumValues`, `getEnumKeys`, etc.
 *
 * @example
 * export enum Role { Admin = 'admin', User = 'user' }
 * const values: EnumType = Object.values(Role); // ['admin', 'user']
 */
export type EnumType =
  | string[]
  | number[]
  | (string | number)[]
  | Record<number, string>;

/**
 * Extracts the actual values from a TypeScript enum (both string and number enums).
 *
 * Handles:
 * - string enums: { A: 'a', B: 'b' }
 * - number enums: { A: 0, B: 1, 0: 'A', 1: 'B' }
 *
 * @param {object} enumType - The enum object to extract values from.
 * @returns {(string | number)[]} An array of enum values (not keys).
 *
 * @example
 * enum MyEnum { A = 'a', B = 'b' }
 * getEnumValues(MyEnum); // ['a', 'b']
 *
 * @example
 * enum NumberEnum { A, B }
 * getEnumValues(NumberEnum); // [0, 1]
 */
export const getEnumValues = (enumType: object): (string | number)[] => {
  if (typeof enumType !== 'object' || enumType === null) {
    return []
  }

  const values = Object.values(enumType)

  // filter out reverse mappings from number enums
  return values.filter((value) => typeof value !== 'string' || !values.includes(Number(value)))
}

/**
 * Returns a random index from a string of characters.
 *
 * @param {string} characters - A string of characters to choose from.
 * @returns {number} A random index.
 */
const randomIndex = (characters: string): number =>
  Math.floor(Math.random() * characters.length)

/**
 * Generates a random numeric value of a given length.
 *
 * @param {number} length - Number of digits in the result.
 * @returns {number} A randomly generated number with the given length.
 *
 * @example
 * randomNumber(6); // → 928371
 */
export const randomNumber = (length: number): number => {
  let result = ''
  const characters = '0123456789'

  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomIndex(characters))
  }

  return Number(result)
}

/**
 * Generates a random alphanumeric code with optional underscore.
 *
 * @param {number} [length=8] - Length of the generated code.
 * @returns {string} A random alphanumeric code.
 *
 * @example
 * randomCode(6); // → 'aZ2_kD'
 */
export function randomCode(length: number = 8): string {
  let randomCode = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'

  while (randomCode.length < length) {
    randomCode += chars[randomIndex(chars)]
  }

  return randomCode
}

/**
 * Converts a numeric (0 or 1) or string value to boolean.
 *
 * @param {string | number} value - Value to convert.
 * @returns {boolean} `true` if 1, `false` if 0.
 * @throws {BadRequestException} If value is not 0 or 1.
 */
export const boolNumberToBool = (value: string | number): boolean => {
  value = Number(value)

  if (value === 1) return true
  if (value === 0) return false

  throw new Error('Bool number value is not supported. Expected 1 or 0')
}

/**
 * Converts a string value ('true' / 'false') to boolean.
 *
 * @param {string} value - Value to convert.
 * @returns {boolean} `true` or `false`.
 * @throws {BadRequestException} If value is not 'true' or 'false'.
 */
export const boolStringToBool = (value: string): boolean => {
  const lower = value.toLowerCase()

  if (lower === 'true') return true
  if (lower === 'false') return false

  throw new Error('Bool string value is not supported. Expected \'true\' or \'false\'')
}

/**
 * Checks if a value is numeric (not boolean).
 *
 * @param value - Any value.
 * @returns {boolean} True if it's a number-like value (excluding booleans).
 */
export const isNumeric = (value: any): boolean =>
  !isNaN(value) && typeof value !== 'boolean'

/**
 * Checks if a value is a real JavaScript number.
 *
 * @param value - Any value.
 * @returns {boolean} True if it's a number.
 */
export const isNumber = (value: any): boolean =>
  !isNaN(value) && typeof value === 'number'

/**
 * Checks if a value is null, undefined, or their string equivalents.
 *
 * @param value - Any value.
 * @returns {boolean} True if the value is considered "empty".
 *
 * @example
 * isEmpty(null);           // true
 * isEmpty('undefined');    // true
 * isEmpty('hello');        // false
 */
export const isEmpty = (value: any): boolean =>
  value === null || value === 'null' || value === undefined || value === 'undefined'

/**
 * Separates elements in an array with a custom separator.
 *
 * @param {any[]} arr - The input array.
 * @param {string} separator - The separator to insert.
 * @returns {any[]} A new array with separators between items.
 *
 * @example
 * separateArray([1, 2, 3], '|'); // [1, '|', 2, '|', 3]
 */
export const separateArray = (arr: any[], separator: string): any[] =>
  arr.reduce((acc, current, index: number) => {
    acc.push(current)
    if (index < arr.length - 1) acc.push(separator)
    
    return acc
  }, [])

/**
 * Rounds a number to a fixed number of decimal places.
 *
 * @param {number} val - Value to round.
 * @param {number} [decimals=6] - Decimal places to preserve.
 * @returns {number} Rounded number.
 *
 * @example
 * round(1.4425236223623, 4)  // 1.4425
 */
export const round = (val: number, decimals: number = 6): number => {
  const multiplier = 10 ** decimals
  
  return Math.round(val * multiplier) / multiplier
}

/**
 * Rounds a number or numeric string using fixed-point notation.
 *
 * @param {number | string} n - Number to format.
 * @param {number} [d=0] - Digits after decimal point.
 * @returns {number} Formatted number.
 */
export const numberToFixed = (n: number | string, d: number = 0): number =>
  Number(Number(n).toFixed(d))

/**
 * Escapes special characters in a string for use in a regular expression.
 *
 * @param {string} text - Raw string.
 * @returns {string} Escaped string.
 *
 * @example
 * escape('[test]'); // → '\\[test\\]'
 */
export const escape = (text: string): string =>
  text.trim().replace(/[-[\]{}()*+?.,\\^$|]/g, '\\$&')

/**
 * Pads the right side of a string with spaces to reach a total length.
 *
 * @param {string} str - Input string.
 * @param {number} totalLength - Target length.
 * @returns {string} Padded string.
 *
 * @example
 * addSpacesToString('abc', 6); // 'abc   '
 */
export const addSpacesToString = (str: string, totalLength: number): string =>
  str.length >= totalLength ? str : str + ' '.repeat(totalLength - str.length)
