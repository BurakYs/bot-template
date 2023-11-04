const { glob } = require('glob');
const logger = require("../utils/logger.js");
const { Events } = require('discord.js');
module.exports = async (client) => {
    const folder = await glob("./commands/*/*.js");
    const commands = [];
    const ownerCommands = [];
    logger.info("Loading slash commands")
    folder.map((value) => {
        let file = require(`../${value}`)
        let json = file.data.toJSON();
        client.commands.push(file.command)
        if (file.command.owner) {
            ownerCommands.push(json);
            client.slashCommands.set(file.data.name, file)
        } else {
            commands.push(json)
            client.slashCommands.set(file.data.name, file)
        }
    });

    client.once(Events.ClientReady, async () => {
        try {
            if (client.config.project.redeployCommands === true) {
                await client.application.commands.set(commands).then(logger.success("Global slash commands are loaded")).catch(e => console.log(e))
                if (ownerCommands.length) await client.application.commands.set(ownerCommands, client.config.guilds.test).then(logger.success("Test guild slash commands are loaded")).catch(e => console.log(e))
            }
        } catch (error) {
            console.log(error)
        }
    });
};
