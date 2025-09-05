export * from './shared'
export * from './evm'
export * from './solana'

/**
 * Supported wallet extensions that can be used for authentication,
 * signing, or interacting with dApps.
 *
 * @enum {string}
 *
 * @property {string} Metamask      - MetaMask browser extension / mobile app.
 * @property {string} WalletConnect - WalletConnect protocol for linking external wallets.
 * @property {string} Phantom       - Phantom wallet (primarily for Solana).
 * @property {string} Coinbase      - Coinbase Wallet extension / mobile app.
 */
export enum WalletExtension {
  Metamask = 'metamask',
  WalletConnect = 'walletconnect',
  Phantom = 'phantom',
  Coinbase = 'coinbase',
}
