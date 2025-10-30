import { isValidAddress } from 'ethereumjs-util'
import { ethers } from 'ethers'
import { verify } from 'web3-token'
import { ChainType, ChainTypes, ChainId } from './shared'

export const zeroAddress = '0x0000000000000000000000000000000000000000'

/**
 * Checks if the given string is a valid EVM (Ethereum-compatible) address.
 *
 * @param {string} address - The address to validate.
 * @returns {boolean} True if the address is a valid EVM address.
 *
 * @example
 * isValidEvmAddress('0xAbC123...'); // true
 */
export const isEvmAddress = (address: string): boolean =>
  isValidAddress(address)

/**
 * Generates a random EVM-compatible wallet address.
 *
 * @returns {string} A randomly generated Ethereum (EVM) address.
 *
 * @example
 * const address = randomEvmAddress();
 * console.log(address); // 0xAbC123...
 */
export const randomEvmAddress = (): string => ethers.Wallet.createRandom().address

/**
 * Checks if a string is a valid EVM-based crypto domain (e.g., 'name.eth', 'my-name.arb').
 *
 * @param {string} val - The domain string to check.
 * @returns {boolean} True if the string is a valid EVM crypto domain.
 *
 * @example
 * isEvmCryptoDomain('vitalik.eth'); // true
 * isEvmCryptoDomain('example.sol'); // false
 */
export const isEvmCryptoDomain = (val: string): boolean => /^[\w-]+\.[\w-]+$/.test(val)

/**
 * Checks if the given chain ID is an EVM network.
 *
 * @param {ChainId} chainId - The blockchain network ID.
 * @returns {boolean} True if the network is EVM-compatible.
 *
 * @example
 * isEvmNetwork(ChainId.Polygon); // true
 */
export const isEvmNetwork = (chainId: ChainId): boolean => ChainTypes.get(chainId) === ChainType.Evm

/**
 * Verifies an EVM signature against a provided address.
 *
 * @param {string} address - The expected wallet address.
 * @param {string} signature - The signed message or payload.
 * @throws {Error} If verification fails or address mismatch occurs.
 *
 * @example
 * verifyEvmSignature('0xabc...', '0xsigned...');
 */
export const verifyEvmSignature = (address: string, signature: string): void => {
  let addressFromSig = ''

  try {
    addressFromSig = verify(signature).address
  } catch {
    throw new Error('Address is not verified')
  }
  
  if (!addressFromSig || addressFromSig.toLowerCase() !== address.toLowerCase()) {
    throw new Error('Address is not verified')
  }
}

/**
 * Extracts a list of function names from a contract ABI.
 *
 * @param {any[]} abi - The contract ABI array.
 * @returns {string[]} An array of function names defined in the ABI.
 *
 * @example
 * const abi = [
 *   { type: 'function', name: 'transfer' },
 *   { type: 'function', name: 'balanceOf' },
 *   { type: 'event', name: 'Transfer' }
 * ];
 *
 * getAbiFunctions(abi);
 * // Returns: ['transfer', 'balanceOf']
 */
export const getAbiFunctions = (input: any[] | string): string[] => {
  const abi = typeof input === 'string' ? JSON.parse(input) : input

  return abi
    .filter((item: { type: string; name: any }) => item.type === 'function' && item.name)
    .map((item: { name: any }) => item.name)
}

export const chainIdToHex = (chainId: ChainId): string => '0x' + (chainId).toString(16)
