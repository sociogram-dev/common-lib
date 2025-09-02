import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'
import { Prop } from '@nestjs/mongoose'
import { getEnumValues } from '..'

type CustomOptions = ApiPropertyOptions | string

/**
 * Helper class for generating Swagger API property decorators with default examples and types.
 * Simplifies usage of @ApiProperty for common data types in DTOs.
 */
export class ApiProp {
  /**
   * Internal builder method for constructing an ApiProperty decorator with default and custom options.
   *
   * @category Swagger
   * @param finalOptions - The base options (example, description, type).
   * @param customOptions - Optional string description or full ApiPropertyOptions to override defaults.
   * @returns The configured ApiProperty decorator.
   */
  static _build(finalOptions: ApiPropertyOptions, customOptions?: ApiPropertyOptions | string) {
    finalOptions.required = true
    if (customOptions) {
      if (typeof customOptions === 'string') {
        finalOptions.description = customOptions
      } else finalOptions = Object.assign(finalOptions, customOptions) as ApiPropertyOptions
    }

    if (finalOptions.isArray) finalOptions.example = [ finalOptions.example, finalOptions.example ]

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
    return this._build({
      example    : '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
      description: 'Solana wallet address',
      type       : String,
    }, customOptions)
  }

  /** Decorator for a Solana wallet address string. */
  static EvmAddress(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs',
      description: 'Solana wallet address',
      type       : String,
    }, customOptions)
  }

  /** Decorator for a token symbol string. */
  static TokenSymbol(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : 'BTC',
      description: 'Token symbol',
      type       : String,
    }, customOptions)
  }

  /** Decorator for a timestamp (number in milliseconds). */
  static Timestamp(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : 1743497459387,
      description: 'Timestamp in milliseconds',
      type       : Number,
    }, customOptions)
  }

  /** Decorator for a boolean flag. */
  static Bool(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : false,
      description: 'Boolean flag',
      type       : Boolean,
    }, customOptions)
  }

  /** Decorator for an image URL string. */
  static ImgUrl(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : 'https://i.pinimg.com/736x/20/b2/0b/20b20b5c3e522416ca19ebda4d00b0ab.jpg',
      description: 'Image url',
      type       : String,
    }, customOptions)
  }

  /** Decorator for a website URL string. */
  static Url(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : 'https://www.pinterest.com/pin/43417583904430184/',
      description: 'Website url',
      type       : String,
    }, customOptions)
  }

  /** Decorator for a decimal number. */
  static Decimal(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : 1657.32,
      description: 'Decimal number',
      type       : Number,
    }, customOptions)
  }

  /** Decorator for a positive integer. */
  static Int(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : 224,
      description: 'Positive integer number',
      type       : Number,
      default    : 0,
    }, customOptions)
  }

  /** Decorator for a simple string. */
  static String(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : 'Last hope',
      description: 'A string text',
      type       : String,
    }, customOptions)
  }

  /** Decorator for a MongoDB ObjectId. */
  static ObjectId(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : '65c3b229c1646139d65db01c',
      description: 'A valid mongodb ObjectId',
      type       : String,
    }, customOptions)
  }

  /** Decorator for an array of strings. */
  static StringArray(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : [ 'father', 'loves', 'mother' ],
      description: 'Array of strings',
      type       : [ String ],
    }, customOptions)
  }

  /** Decorator for an array of integers. */
  static IntArray(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : [ 12, 56, 44 ],
      description: 'Array of integers',
      type       : [ Number ],
    }, customOptions)
  }

  /** Decorator for a generic object. */
  static Object(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : { a: 12, b: 'cat' },
      description: 'Record of any data',
      type       : Object,
    }, customOptions)
  }

  /** Decorator for an array of decimal numbers. */
  static DecimalArray(customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : [ 12.02, 56.32, 44.54 ],
      description: 'Array of decimals',
      type       : [ Number ],
    }, customOptions)
  }

  /**
   * Decorator for enum types.
   *
   * @param enumType - The enum object to document.
   * @param customOptions - Optional description or additional options.
   */
  static Enum(enumType: object, customOptions?: ApiPropertyOptions | string): PropertyDecorator {
    return this._build({
      example    : Object.values(enumType)[0],
      description: 'Enum value',
      enum       : enumType,
    }, customOptions)
  }
}

/**
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
