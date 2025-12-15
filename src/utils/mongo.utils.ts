import { Types } from 'mongoose'
import { Nullable } from './types.utils'

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export enum SortOrder {
  Asc = 1,
  Desc = -1,
}

export type ObjectId = Types.ObjectId;
export type SortExpression = 1 | -1;
export type SortStage = Record<string, SortExpression>;

export class SortField<T> {
  field: T
  order: SortExpression

  constructor(field: T, order: SortExpression) {
    this.field = field
    this.order = order
  }
}

export const toObjectId = (id: string | ObjectId): ObjectId => {
  // already ObjectId
  if (id instanceof Types.ObjectId) id

  if (Types.ObjectId.isValid(id)) {
    return new Types.ObjectId(id)
  }

  throw new Error(`Cannot represent "${id}" to the BSON ObjectId type`)
}

export const objectIdsEquals = (a: Nullable<ObjectId>, b: Nullable<ObjectId>): boolean => {
  if (!a || !b) return false
  if (Types.ObjectId.isValid(a) && Types.ObjectId.isValid(b)) return a.equals(b)

  return false
}

/**
 * Generates an array of sort values from a given enum.
 * For each value in the enum, both ascending (value) and descending (-value) sort keys are returned.
 *
 * @param {Record<string, string>} e - Enum-like object where values are strings.
 * @returns {string[]} Array of sort values including both positive and negative forms.
 *
 * @example
 * ```ts
 * enum SortValue { Name = "name", Date = "date" }
 *
 * getSortValues(SortValue); // ["name", "-name", "date", "-date"]
 * ```
 */
export const getSortValues = (e: Record<string, string>): string[] => {
  const values: string[] = []

  Object.values(e).forEach((val) => {
    values.push(val)
    values.push(`-${val}`)
  })

  return values
}

/**
 * Escapes special regex characters in a string to safely use it inside RegExp.
 *
 * @param {string} value - Raw input string.
 * @returns {string} Escaped string safe for regex construction.
 */
const escape = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Creates a MongoDB regex query object for "search anywhere" functionality.
 * The generated regex matches the given value anywhere inside the target string
 * (equivalent to SQL LIKE '%value%'), case-insensitive.
 *
 * @param {string} value
 * @return {{$regex: string, $options: string}}
 */
export const anywhereSearchRegex = (value: string): { $regex: string; $options: string; } => ({ $regex: '.*' + escape(value) + '.*', $options: 'i' })
