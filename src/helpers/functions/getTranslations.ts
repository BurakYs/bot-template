import { Database } from '@/helpers/classes';
import { Interaction } from '@/interfaces';
import config from '@/config';

const languages: Record<string, Database> = {
    'tr': new Database({ path: './src/localizations/tr.json', cache: true }),
    'en-US': new Database({ path: './src/localizations/en.json', cache: true })
};
languages['en-GB'] = languages['en-US'];
languages['en'] = languages['en-US'];

export default function (interaction: Interaction, path: string): Record<string, any> {
    const { defaultLanguage } = config.bot;
    const defaultTranslations = languages[defaultLanguage].get(path);
    const translations = (languages[interaction.language || interaction.locale] || languages[defaultLanguage]).get(path);

    return translations || defaultTranslations;
}