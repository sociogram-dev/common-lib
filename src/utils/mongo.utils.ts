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
