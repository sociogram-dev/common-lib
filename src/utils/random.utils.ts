import { randomBytes } from 'crypto'

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
export const randomCode = (length: number = 8): string => {
  let randomCode = ''
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'

  while (randomCode.length < length) {
    randomCode += chars[randomIndex(chars)]
  }

  return randomCode
}

/**
 * Generates a random hexadecimal key using cryptographic random bytes.
 *
 * @param {number} [length=32] - Number of random bytes to generate. The resulting string will be twice this length.
 * @returns {string} A random hexadecimal string.
 *
 * @example
 * randomKey(16); // → '9f8e7c1a4d3b2a6f0c1d4e5f8a7b9c0d'
 */
export const randomHex = (length: number = 32): string => randomBytes(length).toString('hex')
