const { glob } = require('glob');
const { promisify } = require('util');
module.exports = async (client) => {
    const folder = await promisify(glob)("./commands/slash/*/*.js");
    const commands = [];
    folder.map((value) => {
        let file = require(`.${value}`);
        commands.push(file.data.toJSON())
        client.slashcmds.set(file.data.name, file);
    });
    const folder2 = await promisify(glob)("./commands/message/*/*.js");
    folder2.map((value) => {
        let file = require(`.${value}`);
        client.messagecmds.set(file.command.name, file);
    });
    client.once('ready', async () => {
        try {
            client.application.commands.set(commands).then(console.log("Global")).catch(e => console.log(e))
        } catch (error) {
            console.log(error)
        }
    });
};
