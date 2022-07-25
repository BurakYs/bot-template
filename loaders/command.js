const fs = require('fs');
module.exports = async (client) => {
    const cmds = fs.readdirSync("./commands/").filter(f => f.split(".").pop() === "js");
    const commands = [];
    for (const file of cmds) {
        const command = require(`../commands/${file}`);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);

    }
    client.once('ready', async () => {
            try {
                    client.application.commands.set(commands)
            } catch (error) {
                console.log(error)
            }
    });
};
