import Client from '@/loaders/base';

export default function (client: Client) {
    Object.defineProperties(String.prototype, {
        'title': {
            value: function (language = 'en') {
                const delimiters = [' ', '_', '/', '-'];
                const splitStr = this.toLocaleLowerCase(language).split(new RegExp(`([${delimiters.join('')}])`));
                return splitStr.map((word: string, index: number) => index % 2 === 0 ? word.charAt(0).toLocaleUpperCase(language) + word.slice(1) : word).join('');
            }
        },
        'change': {
            value: function (replacements: { [key: string]: unknown } = {}) {
                return this.replace(/\{([^}]+?)}/g, (match: unknown, key: string) => {
                    if (key.startsWith('cmd:')) {
                        const commandName = key.slice(4);
                        return client.commandMentions[commandName] || '/' + commandName;
                    }

                    return replacements[key] || match;
                });
            }
        }
    });
}