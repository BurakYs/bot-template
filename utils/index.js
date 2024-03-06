const utils = {};
const utilsArray = ['disableAll', 'getTranslations', 'logger', 'createTitle'];

utilsArray.forEach((name) => {
	utils[name] = require(`./${name}`);
});

module.exports = utils;