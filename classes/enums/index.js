const enums = {};
const enumsArray = ['Environments'];

enumsArray.forEach((name) => {
    enums[name] = require(`./${name}`);
});

module.exports = enums;