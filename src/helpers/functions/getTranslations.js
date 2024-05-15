const { Database } = require('../classes');
const config = require('@/config');

const languages = {
    'tr': new Database({ path: './src/localizations/tr.json', cache: true }),
    'en-US': new Database({ path: './src/localizations/en.json', cache: true })
};
languages['en-GB'] = languages['en-US'];
languages['en'] = languages['en-US'];

function getTranslations(interaction, path) {
    const { defaultLanguage } = config.bot;
    const defaultTranslations = languages[defaultLanguage].get(path);
    const translations = (languages[interaction.language || interaction.locale] || languages[defaultLanguage]).get(path);

    return translations || defaultTranslations;
}

module.exports = getTranslations;