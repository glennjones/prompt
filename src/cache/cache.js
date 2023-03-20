// Description: Base class for cache implementations
class Cache {

    constructor() {}

    async add(key, value) {
        throw new Error("Not implemented");
    }

    async get(key) {
        throw new Error("Not implemented");
    }
}


module.exports = Cache;