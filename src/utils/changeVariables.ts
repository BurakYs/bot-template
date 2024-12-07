export default function changeVariables(text: string, replacements: Record<string, unknown> = {}): string {
  return text.replace(/\{([^}]+?)}/g, (substring: string, ...args: unknown[]): string => {
    const key = args[0] as string;
    return replacements[key]?.toString() || substring;
  });
}