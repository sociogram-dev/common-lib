import dns from 'dns'

/**
 * Ensures that a URL string starts with a protocol (e.g., `https://`).
 * If no protocol is present, the default one is added.
 *
 * @param {string} url - The URL to process.
 * @param {string} [defaultProtocol='https://'] - The protocol to prepend if missing.
 * @returns {string} The normalized URL with a protocol.
 *
 * @example
 * addUrlProtocol('example.com'); // 'https://example.com'
 * addUrlProtocol('http://example.com'); // 'http://example.com'
 */
export const addUrlProtocol = (url: string, defaultProtocol: string = 'https://'): string => {
  const protocolPattern = /^[a-zA-Z]+:\/\//

  if (!protocolPattern.test(url)) {
    return defaultProtocol + url
  }

  return url
}

/**
 * Resolves a given hostname to its IPv4 address using DNS lookup.
 *
 * @param {string} hostname - The domain or hostname to resolve.
 * @returns {Promise<string | null>} A promise that resolves to an IPv4 address or null if not found.
 *
 * @example
 * const ip = await resolveHostnameToIP('example.com'); // '93.184.216.34'
 */
export const resolveHostnameToIP = async (hostname: string): Promise<string | null> => {
  return new Promise((resolve) => {
    dns.lookup(hostname, { family: 4 }, (err, address) => {
      if (err) resolve(null)
      else resolve(address)
    })
  })
}

/**
 * Checks if a given IPv4 address is from a private/local network range.
 *
 * Includes:
 * - 10.0.0.0/8
 * - 172.16.0.0/12
 * - 192.168.0.0/16
 * - 127.0.0.1 (loopback)
 *
 * @param {string} ip - The IPv4 address to check.
 * @returns {boolean} True if the IP is private/internal.
 *
 * @example
 * isPrivateIP('192.168.1.5'); // true
 * isPrivateIP('8.8.8.8');     // false
 */
export const isPrivateIP = (ip: string): boolean => {
  const segments = ip.split('.')
  const secondOctet = parseInt(segments[1], 10)

  return (
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    (ip.startsWith('172.') && secondOctet >= 16 && secondOctet <= 31) ||
    ip === '127.0.0.1'
  )
}
