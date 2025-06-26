/**
 * Regular expression to validate Accept-Language header format.
 *
 * Format: language-tag[;q=qvalue][,language-tag[;q=qvalue]]*
 *
 * Examples of valid values:
 * - "en"
 * - "en-US"
 * - "en-US,en;q=0.9"
 * - "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"
 * - "zh-Hans-CN,zh-Hans;q=0.9,zh;q=0.8"
 */
const acceptLangRegex = /^[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*(\s*;\s*q\s*=\s*(0(\.[0-9]{1,3})?|1(\.0{1,3})?))?\s*(,\s*[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*(\s*;\s*q\s*=\s*(0(\.[0-9]{1,3})?|1(\.0{1,3})?))?\s*)*$/

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
 * Browser types.
 */
export enum Browser {
  Chrome = 'chrome',
  Firefox = 'firefox',
  Safari = 'safari',
  Edge = 'edge',
  Opera = 'opera',
  InternetExplorer = 'ie',
  Samsung = 'samsung',
  UCBrowser = 'uc',
  Yandex = 'yandex',
  Brave = 'brave',
  Vivaldi = 'vivaldi',
  Other = 'other'
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
 * getOS("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/..."); // windows
 *
 * @example
 * getOS("Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)..."); // ios
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
 * @param acceptLang - The Accept-Language header value
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
export const getLangCode = (acceptLang?: string, defaultLang: string = 'en'): string => {
  if (!acceptLang) return defaultLang
  if (!acceptLangRegex.test(acceptLang)) return defaultLang

  // parse Accept-Language header
  // format: "en-US,en;q=0.9,uk;q=0.8,fr;q=0.7"
  const langs = acceptLang
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

/**
 * Checks if the user agent string belongs to a bot/crawler.
 *
 * @param userAgent - User agent string (lowercase)
 * @returns True if it's a bot
 */
const isBotUserAgent = (userAgent: string): boolean => {
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper',
    'googlebot', 'bingbot', 'slurp', 'duckduckbot',
    'baiduspider', 'yandexbot', 'facebookexternalhit',
    'twitterbot', 'rogerbot', 'linkedinbot', 'whatsapp',
    'telegrambot', 'applebot', 'discordbot',
  ]

  return botPatterns.some(pattern => userAgent.includes(pattern))
}

/**
 * Extracts browser name from User-Agent string.
 *
 * @param userAgent - The User-Agent header value
 * @returns Browser information object
 *
 * @example
 * getBrowser('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
 * // chrome
 *
 * @example
 * getBrowser('Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1')
 * // safari
 */
export const getBrowser = (userAgent?: string): Browser => {
  // fallback for missing user agent
  if (!userAgent) return Browser.Other

  const ua = userAgent.toLowerCase()

  // Check for bots first
  if (isBotUserAgent(ua)) return Browser.Other

  // Edge (must be checked before Chrome as it contains Chrome in UA)
  if (ua.includes('edg/') || ua.includes('edge/')) return Browser.Edge

  // Chrome-based browsers (check specific ones first)
  if (ua.includes('samsungbrowser')) return Browser.Samsung

  if (ua.includes('yabrowser')) return Browser.Yandex

  if (ua.includes('opr/') || ua.includes('opera/')) return Browser.Opera

  if (ua.includes('vivaldi')) return Browser.Vivaldi

  if (ua.includes('brave')) return Browser.Brave

  if (ua.includes('ucbrowser')) return Browser.UCBrowser

  // Chrome (check after other Chrome-based browsers)
  if (ua.includes('chrome/') && !ua.includes('chromium/')) return Browser.Chrome

  // Firefox
  if (ua.includes('firefox/')) return Browser.Firefox

  // Safari (check after Chrome-based browsers)
  if (ua.includes('safari/') && !ua.includes('chrome/')) return Browser.Safari

  // Internet Explorer
  if (ua.includes('msie') || ua.includes('trident/')) Browser.InternetExplorer

  return Browser.Other
}
