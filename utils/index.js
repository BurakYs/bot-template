const utils = {};
const utilsArray = ['disableAll', 'getTranslations', 'logger'];

utilsArray.forEach((name) => {
    utils[name] = require(`./${name}`);
});

module.exports = utils;