import config from '@/config';
import JSONDatabase from '@/utils/classes/JSONDatabase';
import type { CommandInteraction } from 'discord.js';

const languages = Object.fromEntries(
  Object.entries(config.bot.supportedLanguages)
    .map(([key, value]) => [key, new JSONDatabase({ path: `./src/localizations/${value}.json`, cache: true })])
);

export default function getTranslations(interaction: CommandInteraction, path: string): any {
  const { defaultLanguage } = config.bot;
  const defaultTranslations = languages[defaultLanguage].get(path);
  const translations = (languages[interaction.language || interaction.locale] || languages[defaultLanguage]).get(path);

  return translations || defaultTranslations;
}