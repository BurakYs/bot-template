import client from '@/loaders/client';

export default function changeVariables(text: string, replacements: Record<string, unknown> = {}): string {
  return text.replace(/\{([^}]+?)}/g, (substring: string, ...args: unknown[]): string => {
    const key = args[0] as string;
    if (key.startsWith('cmd:')) {
      const commandName = key.slice(4);
      return client.commandMentions[commandName] || '/' + commandName;
    }

    return replacements[key]?.toString() || substring;
  });
}