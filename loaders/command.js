const { glob } = require('glob');
<<<<<<< HEAD
const logger = require("../utils/logger.js");
const { Events } = require('discord.js');
module.exports = async (client) => {
    const folder = await glob("./commands/*/*.js");
=======
const logger = require("../utils/logger.js")
module.exports = async (client) => {
    const folder = await glob("./commands/slash/*/*.js");
>>>>>>> 94a3c68f27bd8ae856f00c3d1bf666a54dacbde4
    const commands = [];
    const ownerCommands = [];
    logger.info("Loading slash commands")
    folder.map((value) => {
<<<<<<< HEAD
        let file = require(`../${value}`)
        let json = file.data.toJSON();
        client.commands.push(file.command)
        if (file.command.owner) {
            ownerCommands.push(json);
            client.slashCommands.set(file.data.name, file)
=======
        let file = require(`../${value}`);
        if (client.commands.filter(x => x.owner).map(x => x.name).includes(file.data.name)) {
            ownercommands.push(file.data.toJSON()) && client.slashcmds.set(file.data.name, file);
>>>>>>> 94a3c68f27bd8ae856f00c3d1bf666a54dacbde4
        } else {
            commands.push(json)
            client.slashCommands.set(file.data.name, file)
        }
    });
<<<<<<< HEAD

    client.once(Events.ClientReady, async () => {
=======
    const folder2 = await glob("./commands/context/*/*.js");
    logger.info(`Loading Context Commands`)
    folder2.map((value) => {
        let file = require(`.${value}`);
        commands.push(file.data.toJSON())
        client.contextcmds.set(file.data.name, file);
    });
    const folder3 = await glob("./commands/message/*/*.js");
    logger.info(`Loading Message Commands`)
    folder3.map((value) => {
        let file = require(`.${value}`);
        client.messagecmds.set(file.command.name, file);
        client.utils.findCommand(file.command.name)?.aliases?.forEach(x => {
            client.aliases.set(x, file.command.name);
        })
    });
    client.on('ready', async () => {
>>>>>>> 94a3c68f27bd8ae856f00c3d1bf666a54dacbde4
        try {
            if (client.config.project.redeployCommands === true) {
                client.application.commands.set(commands).then(logger.success("Global slash commands are loaded")).catch(e => console.log(e))
                if (ownerCommands.length) client.application.commands.set(ownerCommands, client.config.guilds.test.id).then(logger.success("Test guild slash commands are loaded")).catch(e => console.log(e))
            }
        } catch (error) {
            console.log(error)
        }
    });
};
