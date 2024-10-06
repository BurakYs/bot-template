import config from '@/config';
import JSONDatabase from '@/utils/classes/JSONDatabase';
import type { Interaction } from '@/types';

const languages: Record<string, JSONDatabase> = {
  'tr': new JSONDatabase({ path: './src/localizations/tr.json', cache: true }),
  'en-US': new JSONDatabase({ path: './src/localizations/en.json', cache: true })
};

languages['en-GB'] = languages['en-US'];
languages['en'] = languages['en-US'];

export default function getTranslations(interaction: Interaction, path: string) {
  const { defaultLanguage } = config.bot;
  const defaultTranslations = languages[defaultLanguage].get(path);
  const translations = (languages[interaction.language || interaction.locale] || languages[defaultLanguage]).get(path);

  return translations || defaultTranslations;
}