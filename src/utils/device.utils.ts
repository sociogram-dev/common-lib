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
 * Enum representing supported operating systems.
 */
export enum OS {
  /** Microsoft Windows operating system */
  Windows = 'windows',

  /** Apple macOS operating system */
  MacOS = 'macos',

  /** Linux-based operating system */
  Linux = 'linux',

  /** Google Android operating system */
  Android = 'android',

  /** Apple iOS operating system */
  IOS = 'ios',

  /** Other or unidentified operating systems */
  Other = 'other',
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

  return Platform.Web
}

/**
 * Detects the operating system from a user-agent string.
 *
 * @param userAgent - The user-agent string from an HTTP request.
 * @returns The detected OS as one of the `OS` enum values.
 *
 * @example
 * getOS(navigator.userAgent);
 * // e.g. "Windows" on a Windows machine
 *
 * @example
 * getOS("Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)...");
 * // returns OS.IOS
 */
export const getOS = (userAgent: string): OS => {
  const ua = userAgent.toLowerCase()

  if (ua.includes('windows nt')) {
    return OS.Windows
  }

  if (ua.includes('mac os x') && !ua.includes('iphone') && !ua.includes('ipad') && !ua.includes('ipod')) {
    return OS.MacOS
  }

  if (ua.includes('android')) {
    return OS.Android
  }

  if (/(iphone|ipad|ipod)/.test(ua)) {
    return OS.IOS
  }

  if (ua.includes('linux')) {
    return OS.Linux
  }

  return OS.Other
}
