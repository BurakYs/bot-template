module.exports = function () {
	Object.defineProperties(Object.prototype, {
		'equalsTo': {
			value: function (targetObject) {
				const [keys1, keys2] = [Object.keys(this), Object.keys(targetObject)];
				if (keys1.length !== keys2.length) return false;

				for (let i = 0; i < keys1.length; i++) {
					const key = keys1[i];
					const [key1Type, key2Type] = [Array.isArray(this[key]) ? 'array' : typeof this[key], Array.isArray(targetObject[key]) ? 'array' : typeof targetObject[key]];

					if (key1Type !== key2Type) return false;
					if (key1Type === 'array' && !this[key].equalsTo(targetObject[key])) return false;
					if (key1Type === 'object' && !this[key].equalsTo(targetObject[key])) return false;

					const otherTypes = ['array', 'object'];
					if (!otherTypes.includes(key1Type) && this[key] !== targetObject[key]) return false;
				}

				return true;
			}
		}
	});
	return true;
};
