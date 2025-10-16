type CacheRecord<T> = {
  value   : T
  expireAt: number
}

/**
 * Simple in-memory cache store with TTL (default: 1 minute)
 */
export class LocalStore<K = string, V = any> {
  private cache = new Map<K, CacheRecord<V>>()

  constructor(private defaultTtl: number = 60_000) {} // 1min by default
  /**
     * Add or update a record in the cache.
     * @param key Unique key for the record
     * @param value Value to store
     * @param ttl Optional time-to-live in milliseconds (default: 1 minute)
     */
  add(key: K, value: V, ttl = this.defaultTtl): void {
    const expireAt = Date.now() + ttl
    this.cache.set(key, { value, expireAt })
  }

  /**
     * Get a value from cache if it's still valid.
     * Automatically removes expired entries.
     */
  get(key: K): V | null {
    const record = this.cache.get(key)
    if (!record) return null

    if (Date.now() > record.expireAt) {
      this.cache.delete(key)
            
      return null
    }

    return record.value
  }

  /**
     * Check if key exists and not expired.
     */
  exist(key: K): boolean {
    const record = this.cache.get(key)
    if (!record) return false

    const isValid = Date.now() <= record.expireAt
    if (!isValid) this.cache.delete(key)
        
    return isValid
  }

  /**
     * Remove a key from the store.
     */
  remove(key: K): void {
    this.cache.delete(key)
  }

  /**
     * Clean all expired records (optional manual cleanup)
     */
  cleanup(): void {
    const now = Date.now()
    for (const [ key, record ] of this.cache.entries()) {
      if (record.expireAt <= now) this.cache.delete(key)
    }
  }
}
