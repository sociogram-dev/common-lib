import { AppEnv } from '../utils'
import { isEvmCryptoDomain, isEvmAddress } from './evm'
import { isSolanaCryptoDomain, isSolanaAddress } from './solana'

export enum ChainType {
  Evm = 'evm',
  Solana = 'solana',
}

export enum ChainId {
  Ethereum = 1,
  Optimism = 10,
  BSC = 56,
  Polygon = 137,
  Solana = 101,
  Arbitrum = 42161,
  SolanaMainnetBeta = 101,

  // test
  Sepolia = 11155111,
  SolanaTestnet = 102,
  SolanaDevnet = 103,
}

/**
 * Blockchain network options.
 */
export type ChainOptions = {
  /**
   * Chain ID.
   */
  id: number;

  /**
   * RPC http-provider.
   */
  rpc: string;

  /**
   * Chain name.
   */
  name: string;

  /**
   * Short name of chain.
   */
  alias: string;

  /**
   * Blockchain explorer.
   */
  explorer: string;
};

/**
 * Checks if a string is either a valid EVM or Solana crypto domain.
 *
 * @param {string} val - The domain string to check.
 * @returns {boolean} True if the string is a valid crypto domain of any supported type.
 *
 * @example
 * isCryptoDomain('alice.sol');     // true
 * isCryptoDomain('bob.crypto');    // true
 * isCryptoDomain('example.com');   // true (⚠️ beware, this regex is permissive)
 */
export const isCryptoDomain = (val: string): boolean =>
  isEvmCryptoDomain(val) || isSolanaCryptoDomain(val)

/**
 * A mapping of supported blockchain network IDs (`ChainId`) to their corresponding chain types (`ChainType`).
 *
 * This allows quick lookup to determine whether a given chain is EVM-based or Solana-based.
 *
 * @example
 * const type = ChainTypes.get(ChainId.SolanaMainnetBeta); // ChainType.Solana
 * const isEvm = ChainTypes.get(ChainId.Polygon) === ChainType.Evm; // true
 */
export const ChainTypes = new Map<ChainId, ChainType>([
  [ ChainId.Arbitrum, ChainType.Evm ],
  [ ChainId.Ethereum, ChainType.Evm ],
  [ ChainId.Optimism, ChainType.Evm ],
  [ ChainId.BSC, ChainType.Evm ],
  [ ChainId.Polygon, ChainType.Evm ],
  [ ChainId.Sepolia, ChainType.Evm ],

  [ ChainId.SolanaMainnetBeta, ChainType.Solana ],
  [ ChainId.SolanaTestnet, ChainType.Solana ],
  [ ChainId.SolanaDevnet, ChainType.Solana ],
])

/**
 * Checks if a given blockchain network (chainId) is available for the specified environment.
 *
 * - In `production`, only mainnets are allowed.
 * - In other environments, testnets/devnets are also allowed.
 *
 * @param {ChainId} chainId - The blockchain network ID.
 * @param {AppEnv} env - The current application environment.
 * @returns {boolean} True if the chain is available for the environment.
 *
 * @example
 * isAvailableChain(ChainId.Arbitrum, AppEnv.Production); // true
 * isAvailableChain(ChainId.SolanaDevnet, AppEnv.Production); // false
 */
export const isAvailableChain = (chainId: ChainId, env: AppEnv): boolean => {
  if (env === AppEnv.Production) {
    return [
      ChainId.Arbitrum,
      ChainId.Ethereum,
      ChainId.BSC,
      ChainId.Optimism,
      ChainId.Polygon,
      ChainId.Solana,
      ChainId.SolanaMainnetBeta,
    ].includes(chainId)
  }

  return [
    ChainId.Sepolia,
    ChainId.SolanaDevnet,
    ChainId.SolanaTestnet,
  ].includes(chainId)
}

/**
 * Checks if the given string is a valid blockchain address (either EVM or Solana).
 *
 * @param {string} val - The address to validate.
 * @returns {boolean} True if the address is valid for either EVM or Solana.
 *
 * @example
 * isAddress('0x215500AB015e50A2b4b1EaB4F005f0bF92879156'); // true
 * isAddress('1ywa3NKfWRX3jpMxWydiWzELuSbdDUhTV5QnoGexjV3e'); // true
 * isAddress('not-an-address'); // false
 */
export const isAddress = (val: string): boolean =>
  isEvmAddress(val) || isSolanaAddress(val)

/**
 * Checks if a string could be a (partial) blockchain address fragment
 * for either EVM or Solana, based on allowed characters and max length.
 * Immediately returns false if the input is shorter than the minimum length.
 *
 * @param val - The string to test.
 * @param minValLength - Minimum length required before performing fragment validation. Defaults to 8.
 * @returns True if the string is a valid prefix/fragment of an EVM or Solana address and meets the minimum length.
 *
 * @example
 * isAddressFragment("0x661892", 6);      // true  (length 8, valid EVM fragment)
 * isAddressFragment("0x66", 8);          // false (too short)
 * isAddressFragment("9v8xqQ", 4);        // true  (length 6 ≥ 4, valid Solana fragment)
 * isAddressFragment("hello123", 8);      // false
 */
export const isAddressFragment = (val: string, minValLength: number = 8): boolean => {
  // Return false immediately if below minimum length
  if (val.length < minValLength) return false

  // full-length constraints:
  const maxEvmLength = 42 // "0x" + 40 hex chars
  const maxSolLength = 44 // up to 44 Base58 chars

  // EVM fragment: must start with "0x", only hex digits, and not exceed max length
  if (/^0x[0-9a-fA-F]*$/.test(val) && val.length <= maxEvmLength) {
    return true
  }

  // Solana fragment: only Base58 chars, and not exceed max length
  // Base58 alphabet excludes 0, O, I, and l
  const base58Pattern = /^[A-HJ-NP-Za-km-z1-9]*$/
  const hasDigit = /[1-9]/.test(val)

  if (base58Pattern.test(val) && hasDigit && val.length <= maxSolLength) {
    return true
  }

  return false
}
