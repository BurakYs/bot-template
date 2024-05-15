export default function () {
    Object.defineProperties(String.prototype, {
        'title': {
            value: function (language = 'en') {
                const delimiters = [' ', '_', '/', '-'];
                const splitStr = this.toLocaleLowerCase(language).split(new RegExp(`([${delimiters.join('')}])`));
                return splitStr.map((word: string, index: number) => index % 2 === 0 ? word.charAt(0).toLocaleUpperCase(language) + word.slice(1) : word).join('');
            }
        },
        'change': {
            value: function (replacements: { [key: string]: any } = {}) {
                return this.replace(/\{([^}]+?)}/g, (match: unknown, key: string) => {
                    const split = key.split(':');
                    const key2 = split.length > 1 ? split[1] : split[0];

                    return replacements[key2] || client.commandMentions[key2] || match;
                });
            }
        }
    });

    return true;
}