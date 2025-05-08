/**
 * Enum representing different application environments.
 */
export enum AppEnv {
  Production = 'prod',
  Stage = 'stage',
  Testing = 'test',
  Development = 'dev',
  Local = 'local',
}

/**
 * Regular expression to match URLs in a string.
 *
 * @example
 * const hasUrl = urlRegex.test('Check this: https://example.com');
 */
export const urlRegex: RegExp =
  /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi

/**
 * Retrieves an environment variable and returns its value as a string.
 * If the variable is not defined, returns the provided default value.
 *
 * @param {string} key - The name of the environment variable.
 * @param {any} [defaults=null] - A default value if the variable is not set.
 * @returns {string} The value of the environment variable or the default.
 *
 * @example
 * const apiUrl = getEnvVar('API_URL', 'https://default.com');
 */
export const getEnvVar = (key: string, defaults: any = null): string => process.env[key] ?? defaults

/**
 * Checks if the application is running in production environment.
 *
 * @returns {boolean} True if `APP_ENV` is 'prod', false otherwise.
 *
 * @example
 * if (isProduction()) {
 *   enableProdMode();
 * }
 */
export const isProduction = (): boolean =>
  getEnvVar('APP_ENV') === AppEnv.Production

/**
 * Checks if the application is running in development environment.
 *
 * @returns {boolean} True if `APP_ENV` is 'dev', false otherwise.
 *
 * @example
 * if (isDevelopment()) {
 *   console.log('Running in development mode');
 * }
 */
export const isDevelopment = (): boolean =>
  getEnvVar('APP_ENV') === AppEnv.Development

/**
 * Checks if the application is running in local environment.
 *
 * @returns {boolean} True if `APP_ENV` is 'local', false otherwise.
 *
 * @example
 * if (isLocal()) {
 *   console.log('Using local configs');
 * }
 */
export const isLocal = (): boolean =>
  getEnvVar('APP_ENV') === AppEnv.Local

/**
 * Checks if the application is running in staging environment.
 *
 * @returns {boolean} True if `APP_ENV` is 'stage', false otherwise.
 *
 * @example
 * if (isStage()) {
 *   runStageOnlyJobs();
 * }
 */
export const isStage = (): boolean =>
  getEnvVar('APP_ENV') === AppEnv.Stage
