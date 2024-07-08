import Client from '@/loaders/base';

export default function (client: Client) {
  Object.defineProperties(String.prototype, {
    'change': {
      value: function (replacements: { [key: string]: unknown } = {}) {
        return this.replace(/\{([^}]+?)}/g, (match: RegExpMatchArray, key: string) => {
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