import { Transform } from 'class-transformer'
import {
  isBooleanString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  IsEnum, IsNumber,
} from 'class-validator'
import { isBoolean } from 'lodash'
import { BadRequestException, applyDecorators, ForbiddenException } from '@nestjs/common'
import Decimal from 'decimal.js'
import { Types } from 'mongoose'
import { isAddress, ChainId, isSolanaAddress, isEvmAddress } from '../blockchain'
import { getEnumValues, toDecimal, isNumeric, boolNumberToBool, boolStringToBool, Nullable } from '../utils'
import { toObjectId, SortDirection } from '../utils/mongo.utils'

/**
 * Checks if the address is a valid. Accepts checksummed addresses too.
 */
export const isValidAddress = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name        : 'isValidAddress',
      target      : object.constructor,
      propertyName: propertyName,
      options     : validationOptions,
      validator   : {
        validate(value: any, args: ValidationArguments) {
          if (!value || value.length < 20) return false
          
          return isAddress(value)
        },
      },
    })
  }
}

/**
 * Custom validation decorator for validating Ethereum-compatible chain IDs.
 *
 * - If the property is a single value → it will be converted to a `number` via `TransformToNumber`.
 * - If the property is an array → all items will be converted to `number[]` via `TransformToNumberArray`.
 * - Uses `IsEnum` to validate that the value belongs to the `ChainId` enum.
 *
 * @param {ValidationOptions} [validationOptions] - Optional validation options.
 *  - If `{ each: true }` is passed, the decorator applies to each element of the array.
 *
 * @returns {PropertyDecorator} A property decorator to use in DTO classes.
 */
export const IsChainId = (validationOptions?: ValidationOptions): PropertyDecorator => {
  const isEach = validationOptions?.each ? true : false
  const decorator = isEach ? TransformToNumberArray() : TransformToNumber()

  return applyDecorators(
    decorator,
    IsEnum(ChainId, { each: isEach, message: ({ value }) => `Invalid Chain Id: ${value}. Expected one of the following values: ${getEnumValues(ChainId).join(', ')}` }),
  )
}

/**
 * Transform incoming value to date.
 */
export const TransformToDate = () => {
  return Transform(({ value }) => {
    const date = new Date(value)
    if (date.toString() === 'Invalid Date') return null

    return date
  })
}

/**
 * Transform incoming value to array of numbers.
 */
export const TransformToNumberArray = () => {
  return Transform(({ value }) =>
    value ? (Array.isArray(value) ? value.map((val) => Number(val)) : [ Number(value) ]) : [],
  )
}

/**
 * Transform incoming value to array of strings.
 */
export const TransformToStringArray = () => {
  return Transform(({ value }) => {
    return value ? (Array.isArray(value) ? value : [ value ]) : []
  })
}

/**
 * Transform incoming value to array of strings.
 * @constructor
 */
export const TransformToSortOrder = () => {
  return Transform(({ value }) =>
    value === SortDirection.Asc ? 1 : -1,
  )
}

/**
 * Transform incoming data to array of numbers.
 *
 * @param {number} num - Default value.
 */
export const TransformToNumber = (num: Nullable<number> = 0) => {
  return Transform(({ value }) => {
    if (value && IsNumber(value)) return toDecimal(value).toDecimalPlaces(6, Decimal.ROUND_DOWN).toNumber()

    return num
  })
}

/**
 * Transform incoming value to Boolean
 */
export const TransformToBool = () => {
  return Transform(({ value }) => {
    if (isBoolean(value)) return value
    if (isNumeric(value)) return boolNumberToBool(value)
    if (isBooleanString(value)) return boolStringToBool(value)

    return null
  })
}

/**
 * Transform incoming address to lowercase.
 */
export const TransformToAddress = () => {
  return Transform(({ value }) => {
    if (value && !isAddress(value)) return null

    return isEvmAddress(value) ? value.toLowerCase() : value
  })
}

const valueToLowerCase = (value: string) => isSolanaAddress(value) ? value : value.toLowerCase()

/**
 * Transform incoming value string to lowercase.
 */
export const TransformToLowercase = () => {
  return Transform(({ value }) => {
    if (Array.isArray(value)) return value.map(v => valueToLowerCase(v))
    
    return valueToLowerCase(value)
  })
}

/**
 * Transform incoming value string to uppercase.
 */
export const TransformToUpperCase = () => {
  return Transform(({ value }) => value.toUpperCase())
}

export const Trim = () => {
  return Transform(({ value }) => value ? value.trim() : '')
}

type TransformToObjectIdOptions = {
  /**
   * Replace with new ObjectId if value is invalid or missing.
  */
  new?: boolean
}

/**
 * Transform incoming value to ObjectId.
 */
export const TransformToObjectId = (ops: TransformToObjectIdOptions = { new: false }) => {
  return Transform(({ value }) => (value && Types.ObjectId.isValid(value) ? toObjectId(value) : (ops.new ? new Types.ObjectId() : null)))
}

/**
 * Transform incoming data to array of ObjectId
 */
export const TransformToObjectIdArray = () => {
  return Transform(({ value, key }) => {
    try {
      return Array.isArray(value) ? value.map((id) => toObjectId(id)) : [ toObjectId(value) ]
    } catch (error) {
      throw new BadRequestException(`${key}: Not all values are ObjectId`)
    }
  })
}

/**
 * Converts an incoming value (string or array of strings) into a filtered array of enum values.
 *
 * @template T - Enum type extending Record<string, string>.
 * @param {T} EnumType - Enum whose values are allowed. Only these values will stay in the result.
 * @returns A `@Transform()` decorator that turns input into a filtered array of enum values.
 */
export const TransformToEnumArray  = <T extends Record<string, string>>(EnumType: T) => {
  const allowedValues = Object.values(EnumType)

  return Transform(({ value }) => {
    if (!value) return []

    const arrayValue = Array.isArray(value) ? value : [ value ]

    const filtered = arrayValue
      .map(v => (typeof v === 'string' ? v.trim().toLowerCase() : v))
      .filter(v => allowedValues.includes(v))
      .filter((v, i, self) => self.indexOf(v) === i)

    return filtered
  })
}

/**
 * Transform incoming data to array of unique values
 * @constructor
 */
export const TransformToUniqueArray = () => {
  return Transform(({ value }) => { return [ ...new Set(value) ] })
}

export const TransformToDecimal = () => {
  return Transform(({ value }) => {
    try {
      return value ? toDecimal(value) : null
    } catch (e) {
      throw new Error('Invalid number value')
    }
  })
}

export const IsPositiveDecimal = (validationOptions?: ValidationOptions) => {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name        : 'IsPositiveDecimal',
      target      : object.constructor,
      propertyName: propertyName,
      options     : validationOptions,
      validator   : {
        validate(value: any, args: ValidationArguments) {
          if (value && value.greaterThan(0)) return true
          throw new ForbiddenException('Number should be positive')
        },
      },
    })
  }
}
