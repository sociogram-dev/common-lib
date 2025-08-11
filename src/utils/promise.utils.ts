/**
 * Collects functions that return promises and executes them all in parallel.
 *
 * @typeParam T The type of the resolved value for each promise.
 */
export class BulkPromises<T> {
  private functions: Array<() => Promise<T>> = []

  /**
   * @param initialFunctions Optional initial array of promise-returning functions.
   *
   * @example
   * // create a BulkPromises instance with initial jobs
   *
   * const bulk = new BulkPromises<string>([
   *  () => Promise.resolve('first'),
   *  () => Promise.resolve('second')
   * ]);
   *
   * const results = await bulk.run(); // ['first', 'second']
   */
  constructor(initialFunctions?: Array<() => Promise<T>>) {
    if (initialFunctions) this.functions = [ ...initialFunctions ]
  }

  /**
   * Adds a new promise-returning function to the batch.
   *
   * @param fn A function returning a Promise of type T.
   * @returns The BulkPromises instance for chaining.
   *
   * @example
   * bulk.add(() => fetchUser(userId));
   */
  add(fn: () => Promise<T>): this {
    this.functions.push(fn)
    
    return this
  }

  /**
   * Conditionally adds a new promise-returning function to the batch.
   *
   * @param condition If true, the function will be added.
   * @param fn A function returning a Promise of type T.
   * @returns The BulkPromises instance for chaining.
   *
   * @example
   * const bulk = new BulkPromises<string>();
   * const hasData = true, hasAvatar = true
   *
   * bulk
   *   .addIf(hasData,   () => Promise.resolve('data loaded'))
   *   .addIf(false,     () => Promise.resolve('this will not run'))
   *   .addIf(hasAvatar, () => fetchAvatar(userId))
   *
   * const results = await bulk.run(); // ['data loaded']
   */
  addIf(condition: boolean, fn: () => Promise<T>): this {
    if (condition) this.functions.push(fn)
    
    return this
  }

  /**
   * Executes all added promise functions in parallel and returns their results.
   * Clears the internal queue after execution.
   *
   * @returns A promise that resolves to an array of results of type T.
   *
   * @example
   * const results = await bulk.run(); // results is T[]
   */
  async run(): Promise<T[]> {
    const jobs = this.functions

    this.functions = []

    if (jobs.length === 0) return []
    
    return Promise.all(jobs.map(fn => fn()))
  }
}
