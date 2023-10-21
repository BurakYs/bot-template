class Cache {
    constructor() {
        this.data = new Map();
        setInterval(this.deleteOld.bind(this), 30000);
    }

    /**
     * Sets a value to a key in the database
     * @param {string} id - The player account ID
     * @param {string} key - The key to set the value to
     * @param {*} value - The value to set
     * @returns {*} The value that was set
     */
    set(id, key, value) {
        let obj = this.data.get(id);
        if (!obj) {
            obj = { id };
            this.data.set(id, obj);
        }
        const keyParts = key.split('.');
        const lastKey = keyParts.pop();
        let nestedObj = obj;
        for (const part of keyParts) {
            if (!nestedObj[part] || typeof nestedObj[part] !== 'object') {
                nestedObj[part] = {};
            }
            nestedObj = nestedObj[part];
        }
        nestedObj[lastKey] = value;
        obj.timestamp = Date.now();
        return value;
    }

    /**
     * Deletes a player from the cache
     * @param {string} id - The player account ID
     * @returns {boolean} Always returns true
     */
    delete(id) {
        this.data.delete(id);
        return true;
    }

    /**
     * Gets a value from a key in the database
     * @param {string} id - The player account ID
     * @param {string} key - The key to get the value from
     * @returns {*} The value that was retrieved
     */
    get(id, key) {
        const obj = this.data.get(id);
        if (!obj) return undefined;
        if (!key) return obj
        const keyParts = key?.split('.');
        let value = obj;
        for (const part of keyParts) {
            value = value[part];
            return value
        }
        return value;
    }

    /**
     * Deletes old cache entries
     * @returns {boolean} Always returns true
     */
    deleteOld() {
        for (const [id, obj] of this.data.entries()) {
            if (obj.timestamp + 1800000 < Date.now()) {
                this.data.delete(id);
            }
        }
        return true;
    }

    /**
     * Deletes all cache entries
     * @returns {boolean} Always returns true
     */
    deleteAll() {
        this.data.clear()
        return true;
    }
}

module.exports = Cache;