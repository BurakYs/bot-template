import JSONDatabase from '@/utils/classes/JSONDatabase';
import config from '@/config';

import type { Interaction } from 'discord.js';

const languages = Object.entries(config.bot.supportedLanguages).reduce<Record<string, JSONDatabase>>((acc, [key, value]) => {
  acc[key] = new JSONDatabase({ path: `./dist/localizations/${value}.json`, cache: true });
  return acc;
}, {});

const { defaultLanguage } = config.bot;

export default function getTranslations(interactionOrLanguage: Interaction | Interaction['language'], path: string) {
  const language = typeof interactionOrLanguage === 'object' ? interactionOrLanguage.language || interactionOrLanguage.locale : interactionOrLanguage;

  const defaultTranslations = languages[defaultLanguage].get(path);
  const languageFile = languages[language] || languages[defaultLanguage];
  const translations = languageFile.get(path);

  return translations || defaultTranslations;
}