import dayjs from 'dayjs'

/**
 * Representing commonly used date formats based on strftime syntax.
 * These formats are useful for formatting dates in analytics, reports, and APIs.
 */
export enum DatetimeFormat {
  /**
   * Year and month (e.g., "2025-05").
   * Suitable for grouping data by month.
   */
  YearMonth = '%Y-%m',

  /**
   * Full date (e.g., "2025-05-27").
   * Commonly used in logs, reports, and filtering by day.
   */
  FullDate = '%Y-%m-%d',

  /**
   * Date with hour and minute (e.g., "2025-05-27 14:30").
   * Suitable for schedules and events.
   */
  DateTimeMinute = '%Y-%m-%d %H:%M',

  /**
   * ISO 8601 format with seconds and Zulu time (e.g., "2025-05-27T14:30:00Z").
   * Often used in APIs and time-based data transfer.
   */
  ISO = '%Y-%m-%dT%H:%M:%SZ',
}

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
