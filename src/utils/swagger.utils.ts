import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Prop } from '@nestjs/mongoose'
import { CurrencyCode } from './currency.utils'
import { randomDecimal, randomInt } from './random.utils'
import { getEnumValues, EnumType } from './types.utils'

type CustomOptions = ApiPropertyOptions | string

/**
 * Helper class for generating Swagger API property decorators with default examples and types.
 * Simplifies usage of @ApiProperty for common data types in DTOs.
 */
export class ApiProp {
  /**
   * Internal builder method for constructing an ApiProperty decorator with default and custom options.
   *
   * @param finalOptions - The base options (example, description, type).
   * @param customOptions - Optional string description or full ApiPropertyOptions to override defaults.
   * @returns The configured ApiProperty decorator.
   */
  static _build(finalOptions: ApiPropertyOptions, customOptions?: ApiPropertyOptions | string) {
    finalOptions.required = true

    if (customOptions) {
      if (typeof customOptions === 'string') {
        finalOptions.description = customOptions
      } else {
        finalOptions = { ...finalOptions, ...customOptions } as ApiPropertyOptions
      }
    }

    if (finalOptions.isArray) {
      finalOptions.example = Array.isArray(finalOptions.example) ? finalOptions.example : [ finalOptions.example ]
    }

    return ApiProperty(finalOptions)
  }

  /**
   * Decorator for a nested DTO model.
   *
   * @param model - The class constructor of the nested model.
   */
  static Nested<T>(model: T): PropertyDecorator {
    return ApiProperty({ type: () => model })
  }

  /** Decorator for a Solana wallet address string. */
  static SolanaAddress(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Solana wallet address',
      example    : '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
      type       : String,
    }, customOptions)
  }

  /** Decorator for a Solana wallet address string. */
  static EvmAddress(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Ethereum wallet address',
      example    : '0x059a8bfd798f29ce665816d12d56400fa47de028',
      type       : String,
    }, customOptions)
  }

  static Ens(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Ethereum Name Service',
      example    : 'arbitrum.arb',
      type       : String,
      default    : null,
      nullable   : true,
      required   : false,
    }, customOptions)
  }

  static SpaceId(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Universal name service web3 domain',
      example    : 'alice.bnb',
      type       : String,
      default    : null,
      nullable   : true,
      required   : false,
    }, customOptions)
  }

  static Unstoppable(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Onchain web3 domain',
      example    : 'sir.eth',
      type       : String,
      default    : null,
      nullable   : true,
      required   : false,
    }, customOptions)
  }

  static Sns(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Solana Name Service',
      example    : 'maria.sol',
      type       : String,
      default    : null,
      nullable   : true,
      required   : false,
    }, customOptions)
  }

  /** Decorator for a token symbol string. */
  static TokenSymbol(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Token symbol',
      example    : 'BTC',
      type       : String,
    }, customOptions)
  }

  /** Decorator for a timestamp (number in milliseconds). */
  static Timestamp(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Timestamp in milliseconds',
      example    : 1743497459387,
      type       : Number,
    }, customOptions)
  }

  /** Decorator for a boolean flag. */
  static Bool(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Boolean flag',
      example    : false,
      type       : Boolean,
    }, customOptions)
  }

  /** Decorator for an image URL string. */
  static ImgUrl(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Image URL',
      example    : 'https://i.pinimg.com/736x/20/b2/0b/20b20b5c3e522416ca19ebda4d00b0ab.jpg',
      type       : String,
    }, customOptions)
  }

  /** Decorator for a website URL string. */
  static Url(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Website URL',
      example    : 'https://www.pinterest.com',
      type       : String,
    }, customOptions)
  }

  /** Decorator for a decimal number. */
  static Decimal(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Decimal number',
      example    : randomDecimal(1, 500, 4),
      type       : Number,
    }, customOptions)
  }

  /** Decorator for a positive integer. */
  static Int(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Positive integer number',
      example    : randomInt(3),
      type       : Number,
      default    : 0,
    }, customOptions)
  }

  /** Decorator for a simple string. */
  static String(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      example    : 'Shit happens',
      description: 'A string text',
      type       : String,
    }, customOptions)
  }

  /** Decorator for a ISO 8601 date string. */
  static Date(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'String date field',
      example    : new Date(),
      type       : String,
    }, customOptions)
  }

  /** Decorator for a MongoDB ObjectId. */
  static ObjectId(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      example    : '65c3b229c1646139d65db01c',
      description: 'A valid MongoDB ObjectId',
      type       : String,
    }, customOptions)
  }

  static ObjectIdArray(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      example    : [ '65c3b229c1646139d65db01c', '85c2b229c1616139d65db00a' ],
      description: 'Array of ObjectId',
      type       : [ String ],
    }, customOptions)
  }

  /** Decorator for an array of strings. */
  static StringArray(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      example    : [ 'father', 'loves', 'mother' ],
      description: 'Array of strings',
      type       : [ String ],
    }, customOptions)
  }

  /** Decorator for an array of integers. */
  static IntArray(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Array of integers',
      example    : [ 12, 56, 44 ],
      type       : [ Number ],
    }, customOptions)
  }

  /** Decorator for a generic object. */
  static Object(objectType: any, customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Record of any data',
      type       : () => objectType,
      required   : false,
    }, customOptions)
  }

  /** Decorator for an array of decimal numbers. */
  static DecimalArray(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Array of decimals',
      example    : [ 12.02, 56.32, 44.54 ],
      type       : [ Number ],
    }, customOptions)
  }

  /**
   * Decorator for enum types.
   *
   * @param enumType - The enum object to document.
   * @param customOptions - Optional description or additional options.
   */
  static Enum(enumType: EnumType, customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Enum values',
      example    : getEnumValues(enumType).at(0),
      enum       : getEnumValues(enumType),
    }, customOptions)
  }

  static Currency(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Currency code',
      example    : CurrencyCode.USD,
      type       : String,
      required   : true,
      enum       : getEnumValues(CurrencyCode),
    }, customOptions)
  }

  static PublicId(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return ApiProp._build({
      description: 'Entity public numeric identifier',
      example    : 13,
      type       : Number,
      default    : 1,
    }, customOptions)
  }
}

/**
 * TODO: need to delete !!!
 * Decorate Field with Mongoose Prop and Swagger ApiProperty
 */
export class ComposeProp extends ApiProp {
  /**
   * Internal builder method for constructing an all decorators with default and custom options.
   *
   * @param finalOptions - The base options (example, description, type).
   * @param customOptions - Optional string description or full ApiPropertyOptions to override defaults.
   * @returns The configured ApiProperty decorator.
   */
  static _build(finalOptions: ApiPropertyOptions, customOptions?: CustomOptions): PropertyDecorator {
    const extendedDecorator = super._build(finalOptions, customOptions)
    
    return (target: any, propertyKey: string | symbol) => {
      extendedDecorator(target, propertyKey)
      Prop({ 
        type    : finalOptions.type,
        enum    : finalOptions.enum ? getEnumValues(finalOptions.enum as any) : undefined,
        default : finalOptions.default,
        required: finalOptions.required,
      })(target, propertyKey)
    }
  }
}
