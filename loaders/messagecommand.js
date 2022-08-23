const { glob } = require('glob');
const { promisify } = require('util');
module.exports = async (client) => {
    const commandss = await promisify(glob)("./mcommands/*/*.js");
    commandss.map((value) => {
        let file = require(`.${value}`);
        client.mcommands.set(file.command.name, file);
    });
};
