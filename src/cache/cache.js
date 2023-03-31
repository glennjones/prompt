// Description: Base class for cache implementations
/**
 * Base class for cache implementations
 * @class Cache
 */
class Cache {
    /**
     * Creates an instance of Cache.
     * @constructor
     * */
    constructor() {}

    /**
     * Adds a key value pair to the cache
     * @param {string} key - The key to store the value under
     * @param {Object} value - The value to store
     * @returns {Promise} - A promise that resolves when the object is stored
     * */
    async add(key, value) {
        throw new Error("Not implemented");
    }

    /**
     * Gets the value stored under the key
     * @param {string} key - The key to get the value for
     * @returns {Promise} - A promise that resolves to the object stored under the key
     * */
    async get(key) {
        throw new Error("Not implemented");
    }
}


module.exports = Cache;