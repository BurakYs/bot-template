const Database = require('../classes/Database.js');
const languages = {
	'tr': new Database({ path: './localizations/tr.json', cache: true }),
	'en-US': new Database({ path: './localizations/en.json', cache: true })
};
languages['en-GB'] = languages['en-US'];
languages['en'] = languages['en-US'];

function getTranslations(interaction, path) {
	const { defaultLanguage } = client.config.bot;

	return (languages[interaction.language || interaction.locale] || languages[defaultLanguage])?.get(path) || languages[defaultLanguage].get(path);
}

module.exports = getTranslations;