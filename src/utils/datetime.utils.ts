import dayjs from 'dayjs'

/**
 * Pauses execution for a given duration.
 *
 * @param {number} [ms=1000] - Duration in milliseconds to sleep (default is 1000ms).
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 *
 * @example
 * await sleep(2000); // Waits for 2 seconds
 */
export const sleep = async (ms: number = 1000): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Converts a Unix timestamp (in seconds or milliseconds) to Date object.
 * Detects whether the timestamp is in seconds or milliseconds.
 *
 * @param {number} timestamp - The Unix timestamp. Can be in seconds or milliseconds.
 * @returns {Date} Date object.
 *
 * @example
 * unixToDate(1715170000);      // timestamp in seconds
 * unixToDate(1715170000000);   // timestamp in milliseconds
 */
export const unixToDate = (timestamp: number): Date => {
  // if the number is less than 10^11, it is probably seconds.
  const isSeconds = timestamp < 1e11

  return isSeconds
    ? dayjs.unix(timestamp).toDate()
    : dayjs(timestamp).toDate()
}
