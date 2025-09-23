export * from './shared'
export * from './evm'
export * from './solana'

/**
 * Supported wallet extensions that can be used for authentication, signing, or interacting with dApps.
 *
 * @enum {string}
 */
export enum WalletExtension {
  Metamask = 'metamask',
  Phantom = 'phantom',
  BaseWallet = 'base',
  TrustWallet = 'trustwallet',
  Rabby = 'rabby',
  OkxWallet = 'okx',
  BitgetWallet = 'bitget',
  BinanceWallet = 'binance',
  Zerion = 'zerion',
  Rainbow = 'rainbow',
  Brave = 'brave',
  TokenPocket = 'tokenpocket'
}
