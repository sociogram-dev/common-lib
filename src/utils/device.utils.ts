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
 * getOS("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/..."); // Windows
 *
 * @example
 * getOS("Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)..."); // IOS
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

/**
 * Extracts the primary language code from the Accept-Language header.
 *
 * @param acceptLanguage - The Accept-Language header value
 * @param defaultLang - The language code in not defined
 * @returns The primary language code (e.g., 'en', 'uk', 'fr') or 'en' as fallback
 *
 * @examples
 * ```typescripte
 * getLanguageCode('en-US,en;q=0.9,uk;q=0.8') // 'en'
 * getLanguageCode('uk-UA,uk;q=0.9') // 'uk'
 * getLanguageCode('fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7') // 'fr'
 * getLanguageCode('') // 'en'
 * getLanguageCode(undefined) // 'en'
 * ```
 */
export const getLangCode = (acceptLanguage?: string, defaultLang: string = 'en'): string => {
  if (!acceptLanguage) return defaultLang

  // parse Accept-Language header
  // format: "en-US,en;q=0.9,uk;q=0.8,fr;q=0.7"
  const langs = acceptLanguage
    .split(',')
    .map(lang => {
      const [ code, qValue ] = lang.trim().split(';')
      const quality = qValue ? parseFloat(qValue.replace('q=', '')) : 1.0

      return { code: code.trim(), quality: isNaN(quality) ? 1.0 : quality }
    })
    .sort((a, b) => b.quality - a.quality) // Sort by quality (preference)

  if (langs.length === 0) return defaultLang

  // get the primary language code (before the hyphen)
  const primaryLang = langs[0].code.split('-')[0].toLowerCase()

  return primaryLang || defaultLang
}
