import { isSolanaAddress, isEvmAddress } from '../blockchain'

/**
 * Enum representing the types of metadata entities that can be extracted from text.
 */
export enum MetadataEntity {
  Hashtag = 'hashtags',
  Cashtag = 'cashtags',
  Link = 'links',
  Mention = 'mentions',
  Emoji = 'emojis',
  WebPage = 'webPage'
}

/**
 * Enum representing the uppercased type identifiers for each metadata entity.
 */
export enum MetadataType {
  Cashtag = 'CASHTAG',
  Emoji = 'EMOJI',
  Hashtag = 'HASHTAG',
  Link = 'LINK',
  Mention = 'MENTION',
}

/**
 * Base interface for a tagged text segment (e.g., hashtag, mention).
 */
export interface Tag {
  /** The type of the tag */
  type: MetadataType;

  /** Offset in the text where the tag starts */
  offset: number;

  /** Length of the tag in characters */
  length: number;

  /** The raw string value of the tag */
  value: string;
}

/**
 * Hashtag metadata (e.g., #hello).
 */
export interface Hashtag extends Tag {
  type: MetadataType.Hashtag;
}

/**
 * Cashtag metadata (e.g., $BTC).
 */
export interface Cashtag extends Tag {
  type: MetadataType.Cashtag;
}

/**
 * Link metadata with resolved URL.
 */
export interface Link extends Tag {
  type: MetadataType.Link;

  /** Fully resolved URL (e.g., https://...) */
  url: string;
}

/**
 * Mention metadata (e.g., @username).
 */
export interface Mention extends Tag {
  type: MetadataType.Mention;

  /** Resolved profile link (e.g., https://twitter.com/...) */
  url: string;

  /** Display name or visible text (optional) */
  text: string;

  /** The username or value without '@' */
  value: string;
}

/**
 * Emoji metadata (e.g., 😀).
 */
export interface Emoji extends Tag {
  type: MetadataType.Emoji;
}

/**
 * Combined metadata extracted from a text block.
 */
export interface TextMetadata {
  /** List of extracted hashtags */
  hashtags: Hashtag[];

  /** List of extracted cashtags */
  cashtags: Cashtag[];

  /** List of extracted links */
  links: Link[];

  /** List of extracted mentions */
  mentions: Mention[];

  /** List of emojis in the text */
  emojis: Emoji[];

  /** Optional web page preview or metadata (type: any) */
  webPage: any;
}

/**
 * Extracts and normalizes blockchain addresses from a list of mention entities.
 *
 * Recognizes both Solana and EVM-compatible addresses.
 * EVM addresses are converted to lowercase for consistency.
 *
 * @param {Mention[]} mentions - Array of mention metadata objects.
 * @returns {string[]} A list of valid blockchain addresses found in the mentions.
 *
 * @example
 * const addresses = extractMentionAddresses(mentions);
 * // → ['0xabc...', '9v8x...']
 */
export const extractMentionAddresses = (mentions: Mention[]): string[] => {
  const adresses = []

  for (const mention of mentions) {
    if (!mention.value) continue
    if (isSolanaAddress(mention.value)) adresses.push(mention.value)
    if (isEvmAddress(mention.value)) adresses.push(mention.value.toLowerCase())
  }

  return adresses
}

/**
 * Converts a given text into an array of words.
 *
 * @description This function uses the `Intl.Segmenter` API to segment the text into words.
 * @return {string[]} Array of strings.
 *
 * @example
 * toWords('Lorem ispum')  // [ 'Lorem', 'ispum' ]
 */
export const toWords = (text: string): string[] => {
  const segmenter = new Intl.Segmenter([], { granularity: 'word' })
  const segments = segmenter.segment(text)

  return [ ...segments ].filter(s => s.isWordLike).map(s => s.segment)
}
