
module.exports = {

    /**
     * Makes a deep copy of an object
     * @param {Object} obj
     * @return {Object}
     */
    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Checks if a value is an object
     * @param {any} value
     * @return {boolean}
     */
    isObject(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    },

    /**
     * Checks if a value is a string
     * @param {any} value
     * @return {boolean}
     */
    isString(value) {
        return typeof value === 'string' || value instanceof String;
    }

}
