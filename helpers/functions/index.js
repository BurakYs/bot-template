const utils = {};
const utilsArray = ['disableAll', 'getTranslations', 'createTitle'];

utilsArray.forEach((name) => {
	utils[name] = require(`./${name}`);
});

module.exports = utils;