/**
 * Enum representing supported user platforms.
 */
export enum Platform {
  /** Android-based device */
  Android = 'android',

  /** Apple iOS device (iPhone, iPad, iPod) */
  IOS = 'ios',

  /** Desktop platform (e.g., Windows, macOS, Linux) */
  Desktop = 'desktop',

  /** Web browser, unknown platform (used when explicitly targeting browser-only environments) */
  Web = 'web',
}

/**
 * Detects the platform of the user based on their User-Agent string.
 *
 * @param {string} userAgent - The user agent string, typically from the request headers.
 * @returns {Platform} The inferred platform (Android, IOS, or Desktop).
 *
 * @example
 * const platform = getPlatform(req.headers['user-agent']);
 * if (platform === Platform.IOS) {
 *   // do something for iOS users
 * }
 */
export const getPlatform = (userAgent?: string): Platform => {
  // fallback
  if (!userAgent) return Platform.Desktop
  
  const isAndroid = /Android/i.test(userAgent)
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent)

  if (isAndroid) return Platform.Android
  if (isIOS) return Platform.IOS

  return Platform.Desktop
}
