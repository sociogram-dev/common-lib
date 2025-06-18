import dayjs from 'dayjs'

/**
 * Represents common time intervals.
 */
export enum Period {
  /** One hour */
  Hour = 'hour',
  /** One day */
  Day = 'day',
  /** One week */
  Week = 'week',
  /** One month */
  Month = 'month',
  /** One year */
  Year = 'year',
}

/**
 * Enum representing predefined time ranges for filtering or querying data.
 */
export enum PeriodRange {
  /** All available data since inception */
  AllTime = 'all-time',

  /** Data from the last 7 days */
  LastWeek = 'last-week',

  /** Data from the last 30 days */
  LastMonth = 'last-month',
}

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

/**
 * Returns the Unix timestamp (in milliseconds) for the start of the given period.
 *
 * @param date   - The date object for which to calculate the start of the period.
 * @param period - The time period (hour, day, week, month, or year).
 * @returns The timestamp in milliseconds representing the start of the specified period.
 *
 * @example
 * ```typescript
 * * ```typescript
 * * // Start of hour
 * * const hourStart = getStartOf(new Date('2024-05-22T15:45:30Z'), Period.Hour)
 * * console.log(hourStart) // 1716390000000
 *
 * // Start of day
 * const dayStart = getStartOf(new Date('2024-05-22T15:45:00Z'), Period.Day)
 * console.log(dayStart) // 1716390000000
 *
 * // Start of week (Sunday)
 * const weekStart = getStartOf(new Date('2024-05-22T15:45:00Z'), Period.Week)
 * console.log(weekStart) // 1716390000000
 *
 * // Start of month
 * const monthStart = getStartOf(new Date('2024-05-22T15:45:00Z'), Period.Month)
 * console.log(monthStart) // 1716390000000
 *
 * // Start of year
 * const yearStart = getStartOf(new Date('2024-05-22T15:45:00Z'), Period.Year)
 * console.log(yearStart) // 1716390000000
 * ```
 */
export const getStartOf = (date: Date, period: Period): number => {
  const start = new Date(date)

  switch (period) {
    case Period.Day:
      start.setHours(0, 0, 0, 0)
      break

    case Period.Week:
      // Set to Sunday (0) of the current week
      const dayOfWeek = start.getDay()
      start.setDate(start.getDate() - dayOfWeek)
      start.setHours(0, 0, 0, 0)
      break

    case Period.Month:
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      break

    case Period.Year:
      start.setMonth(0, 1)
      start.setHours(0, 0, 0, 0)
      break

    default:
      throw new Error(`Unsupported period: ${period}`)
  }

  return start.getTime()
}
