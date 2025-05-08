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
 * Checks if the given string is a valid blockchain address (either EVM or Solana).
 *
 * @param {string} val - The address to validate.
 * @returns {boolean} True if the address is valid for either EVM or Solana.
 *
 * @example
 * isAddress('0x661892e6e27383152c...'); // true
 * isAddress('9v8xqQ...'); // true
 * isAddress('not-an-address'); // false
 */
export const isAddress = (val: string): boolean =>
  isEvmAddress(val) || isSolanaAddress(val)
