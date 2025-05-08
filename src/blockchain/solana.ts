import {
  verifySignature,
  getAddressEncoder,
  ReadonlyUint8Array,
  SignatureBytes,
  Address,
  isAddress,
} from '@solana/web3.js'
import { ChainTypes, ChainType, ChainId } from './shared'

export const lamportsPerSol = 1_000000000

/**
 * Checks if the given string is a valid Solana address.
 *
 * @param {string} address - The address to validate.
 * @returns {boolean} True if the address is a valid Solana base58 address.
 *
 * @example
 * isValidSolanaAddress('9v8xqQZkT1S...'); // true
 */
export const isSolanaAddress = (address: string): boolean =>
  isAddress(address)

/**
 * Checks if a string is a valid Solana-based crypto domain (e.g., 'username.sol').
 *
 * @param {string} val - The domain string to check.
 * @returns {boolean} True if the string is a Solana crypto domain.
 *
 * @example
 * isSolanaCryptoDomain('phantom.sol'); // true
 * isSolanaCryptoDomain('wallet.eth');  // false
 */
export const isSolanaCryptoDomain = (val: string): boolean =>
  /^[\w-]+\.sol$/.test(val)

/**
 * Checks if the given chain ID is a Solana network.
 *
 * @param {ChainId} chainId - The blockchain network ID.
 * @returns {boolean} True if the network is Solana.
 *
 * @example
 * isSolanaNetwork(ChainId.SolanaMainnetBeta); // true
 */
export const isSolanaNetwork = (chainId: ChainId): boolean => ChainTypes.get(chainId) === ChainType.Solana

/**
 * Verifies a Solana wallet signature.
 *
 * @param {string} address - The expected Solana address (base58).
 * @param {string} sig - The base64-encoded string containing JSON with body and signature.
 * @throws {BadRequestException} If the signature is invalid, expired, or malformed.
 *
 * @example
 * await verifySolanaSignature('4Nd1m...', 'base64EncodedString');
 */
export const verifySolanaSignature = async (
  address: string,
  sig: string,
): Promise<void> => {
  try {
    const decodedString = Buffer.from(sig, 'base64').toString('utf8')
    const { signature, body } = JSON.parse(decodedString)

    const issuedAtMatch = body.match(/Issued At: (.+)/)
    const expirationMatch = body.match(/Expiration Time: (.+)/)

    if (!issuedAtMatch || !expirationMatch)
      throw new Error('Date fields not found in the raw message')

    const issuedAt = new Date(issuedAtMatch[1])
    const expirationTime = new Date(expirationMatch[1])
    const now = new Date()

    if (issuedAt >= expirationTime || issuedAt > now || now >= expirationTime) {
      throw new Error('Expired or invalid signed message')
    }

    const encodedAddress = getAddressEncoder().encode(address as Address)
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encodedAddress,
      'Ed25519',
      true,
      [ 'verify' ],
    )
    const formattedSignature = Uint8Array.from(Buffer.from(signature, 'base64')) as SignatureBytes
    const formattedMessage = Uint8Array.from(Buffer.from(body)) as ReadonlyUint8Array

    const verified = await verifySignature(cryptoKey, formattedSignature, formattedMessage)

    if (!verified) throw new Error('Address is not verified')
  } catch (e: any) {
    throw new Error(e.message)
  }
}
