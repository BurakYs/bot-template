const utils = {};
const utilsArray = ['disableAll', 'getTranslations', 'Logger', 'createTitle'];

utilsArray.forEach((name) => {
	utils[name] = require(`./${name}`);
});

module.exports = utils;