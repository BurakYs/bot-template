import i18next from 'i18next';
import config from '@/config';

const { defaultLanguage, supportedLanguages } = config.bot;

export default async function setupI18n() {
  await i18next.init({
    fallbackLng: defaultLanguage,
    lng: defaultLanguage,
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false,
      prefix: '{',
      suffix: '}'
    }
  });

  await Promise.all(Object.entries(supportedLanguages).map(async ([key, value]) => {
    const { default: language } = await import(`@/localizations/${value}.json`);
    i18next.addResourceBundle(key, 'translation', language);
  }));
}
