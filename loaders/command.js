const { glob } = require('glob');
const { promisify } = require('util');
module.exports = async (client) => {
    const commandss = await promisify(glob)("./commands/*/*.js");
    const commands = [];
    commandss.map((value) => {
        let file = require(`.${value}`);
        commands.push(file.data.toJSON());
        client.commands.set(file.data.name, file);
    });
    client.once('ready', async () => {
        try {
            client.application.commands.set(commands)
        } catch (error) {
            console.log(error)
        }
    });
};
