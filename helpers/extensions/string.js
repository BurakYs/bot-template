module.exports = function () {
	Object.defineProperties(String.prototype, {
		'title': {
			value: function (language = 'en') {
				const delimiters = [' ', '_', '/', '-'];
				let splitStr = this.toLocaleLowerCase(language).split(new RegExp(`([${delimiters.join('')}])`));
				return splitStr.map((word, index) => index % 2 === 0 ? word.charAt(0).toLocaleUpperCase(language) + word.slice(1) : word).join('');
			}
		},
		'change': {
			value: function (replacements = {}) {
				return this.replace(/\{([^}]+?)}/g, (match, key) => {
					const split = key.split(':');
					const key2 = split.length > 1 ? split[1] : split[0];
					return replacements[key2] || client.commands.find(x => x.name === key2)?.mention || match;
				});
			}
		}
	});
	return true;
};