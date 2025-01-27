import config from '@/config';
import JSONDatabase from '@/utils/classes/JSONDatabase';
import type { Interaction } from 'discord.js';

const languages = Object.entries(config.bot.supportedLanguages).reduce<Record<string, JSONDatabase>>((acc, [key, value]) => {
  acc[key] = new JSONDatabase({ path: `./dist/localizations/${value}.json`, cache: true });
  return acc;
}, {});

export default function getTranslations(interaction: Interaction, path: string): any {
  const { defaultLanguage } = config.bot;
  const defaultTranslations = languages[defaultLanguage].get(path);
  const translations = (languages[interaction.language || interaction.locale] || languages[defaultLanguage]).get(path);

  return translations || defaultTranslations;
}