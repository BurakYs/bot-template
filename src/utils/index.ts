export function randomFromArray<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function changeVariables(text: string, replacements: Record<string, unknown> = {}) {
  return text.replace(/\{([^}]+?)}/g, (substring: string, ...args: unknown[]) => {
    const key = args[0] as string;
    return replacements[key]?.toString() || substring;
  });
}

export { default as getTranslations } from './getTranslations';