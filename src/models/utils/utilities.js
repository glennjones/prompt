

module.exports = {

    /**
     * Makes a deep copy of an object
     * @param {Object} obj
     * @return {Object}
     */
    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

}
