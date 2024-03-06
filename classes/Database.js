const fs = require('fs');

class Database {
	constructor(options = {}) {
		this.path = options.path;
		this.cache = options.cache ? {} : null;
		this.readedFile = false;
	}

	/**
	 * Reads the data and returns it
	 * @returns {Object}
	 */
	all() {
		if (this.cache && (this.readedFile || !this.path)) return this.cache;
		if (this.cache && !this.readedFile && this.path) {
			this.readedFile = true;
			const data = fs.readFileSync(this.path, 'utf8');
			return this.cache = JSON.parse(data);
		}
		try {
			const data = fs.readFileSync(this.path, 'utf8');
			return JSON.parse(data);
		} catch (error) {
			try {
				fs.writeFileSync(this.path, '{}');
				return {};
			} catch (e) {
				const folderPath = this.path.substring(0, this.path.lastIndexOf('/'));
				fs.mkdirSync(folderPath, { recursive: true });
				fs.writeFileSync(this.path, '{}');
				return {};
			}
		}
	}

	/**
	 * Sets a value to a key in the database
	 * @param {string} key - The key to set the value to
	 * @param {*} value - The value to set
	 * @returns {*} The value that was set
	 */
	set(key, value) {
		const keys = key.split('.');
		const data = this.all();
		let current = data;

		for (let i = 0; i < keys.length - 1; i++) {
			if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
				current[keys[i]] = {};
			}
			current = current[keys[i]];
		}

		current[keys[keys.length - 1]] = value;
		let updatedData = data;
		let lastKey = keys.pop();
		for (const key of keys) {
			updatedData = updatedData[key];
		}
		updatedData[lastKey] = current[lastKey];

		!this.cache ? fs.writeFileSync(this.path, JSON.stringify(data, null, 2)) : this.cache = data;

		return value;
	}

	/**
	 * Gets a value from a key in the database
	 * @param {string} key - The key to get the value from
	 * @returns {*} The value that was retrieved
	 */
	get(key) {
		if (!key) return this.all();

		const keys = key.split('.');
		let current = this.all();

		for (let i = 0; i < keys.length; i++) {
			if (current.hasOwnProperty(keys[i])) {
				current = current[keys[i]];
			} else {
				current = null;
				break;
			}
		}
		return current;
	}

	/**
	 * Pushes a value to a key in the database
	 * @param {string} key - The key to push the value to
	 * @param {*} value - The value to push
	 * @returns {*} The value that was pushed
	 */
	push(key, value) {
		let currentValue = this.get(key);

		if (!Array.isArray(currentValue)) currentValue = [];

		currentValue.push(value);
		this.set(key, currentValue);

		return value;
	}

	/**
	 * Deletes a key from the database
	 * @param {string} key - The key to delete
	 * @returns {boolean} Whether the key was successfully deleted
	 */
	delete(key) {
		this.set(key, undefined);
		return true;
	}

	/**
	 * Adds a value to a key in the database
	 * @param {string} key - The key to add the value to
	 * @param {number} value - The value to add
	 * @returns {number} The value that was added
	 */
	add(key, value) {
		const currentValue = this.get(key);

		if (isNaN(value)) return undefined;

		this.set(key, currentValue + value);

		return value;
	}

	/**
	 * Subtracts a value from a key in the database
	 * @param {string} key - The key to subtract the value from
	 * @param {number} value - The value to subtract
	 * @returns {number} The value that was subtracted
	 */
	subtract(key, value) {
		const currentValue = this.get(key);

		if (isNaN(currentValue)) return undefined;

		this.set(key, currentValue - value);

		return value;
	}

	/**
	 * Deletes all keys from the database
	 * @returns {boolean} Whether the database was successfully cleared
	 */
	destroy() {
		this.cache = {};
		fs.writeFileSync(this.path, '{}');
		return true;
	}
}

module.exports = Database;