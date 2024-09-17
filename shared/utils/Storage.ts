/**
 * Creates a local storage object with methods for caching and managing cookies.
 * @param {string} [prefixKey=''] - Optional prefix for cache keys.
 * @param {Storage} [storage=localStorage] - Optional storage object (sessionStorage or localStorage).
 * @returns {Storage} An instance of the Storage class with methods for managing cache and cookies.
 */
export const createStorage = ({
  prefixKey = "",
  storage = localStorage,
} = {}) => {
  /**
   * Local storage class for managing cache and cookies.
   */
  class Storage {
    private storage = storage;
    private prefixKey = prefixKey;

    private getKey(key: string): string {
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /**
     * Sets a value in cache.
     * @param {string} key - Cache key.
     * @param {*} value - Cache value.
     * @param {number | null} [expire=null] - Optional expiration time in seconds.
     */
    set(key: string, value: any, expire: number | null = null): void {
      const stringData = JSON.stringify({
        value,
        expire: expire !== null ? Date.now() + expire * 1000 : null,
      });
      this.storage.setItem(this.getKey(key), stringData);
    }

    /**
     * Retrieves a value from cache.
     * @param {string} key - Cache key.
     * @param {*} [def=null] - Default value if key is not found or data is expired.
     * @returns {T} - The cached value or the default value.
     */
    get<T = any>(key: string, def: any = null): T {
      const item = this.storage.getItem(this.getKey(key));
      if (item) {
        try {
          const data = JSON.parse(item);
          const { value, expire } = data;
          if (expire === null || expire >= Date.now()) {
            return value;
          }
          this.remove(this.getKey(key));
        } catch {
          return def;
        }
      }
      return def;
    }

    /**
     * Removes an item from cache.
     * @param {string} key - Cache key.
     */
    remove(key: string): void {
      console.log("Removing:", key);
      this.storage.removeItem(this.getKey(key));
    }

    /**
     * Clears all cache items.
     */
    clear(): void {
      this.storage.clear();
    }

    /**
     * Sets a cookie.
     * @param {string} name - Cookie name.
     * @param {*} value - Cookie value.
     * @param {number | null} [expire=null] - Optional expiration time in seconds.
     */
    setCookie(name: string, value: any, expire: number | null = null): void {
      document.cookie = `${this.getKey(name)}=${value}; Max-Age=${expire}`;
    }

    /**
     * Gets the value of a cookie by name.
     * @param {string} name - Cookie name.
     * @returns {string} - The cookie value.
     */
    getCookie(name: string): string {
      const cookieArr = document.cookie.split("; ");
      for (const cookie of cookieArr) {
        const [key, value] = cookie.split("=");
        if (key === this.getKey(name)) {
          return value;
        }
      }
      return "";
    }

    /**
     * Removes a cookie by name.
     * @param {string} key - Cookie name.
     */
    removeCookie(key: string): void {
      this.setCookie(key, "", -1);
    }

    /**
     * Clears all cookies.
     */
    clearCookie(): void {
      const keys = document.cookie.match(/[^ =;]+(?==)/g);
      if (keys) {
        for (const key of keys) {
          document.cookie = `${key}=; expires=${new Date(0).toUTCString()}`;
        }
      }
    }
  }

  return new Storage();
};

// Create and export a default instance of Storage
export const Storage = createStorage();
export default Storage;
