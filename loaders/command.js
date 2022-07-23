const fs = require('fs');
module.exports = async (client) => {
    const cmds = fs.readdirSync("./commands/").filter(f => f.split(".").pop() === "js");
    const commands = [];
    for (const file of cmds) {
        const command = require(`../commands/${file}`);
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);

    }
    client.on("guildCreate", async guild => {
        try {

            await client.guilds.cache.get(guild.id)?.commands.set(commands)
        } catch (error) {
            console.log(error)
        }
    })

    client.once('ready', async () => {
            try {
                client.guilds.cache.forEach(guild => {
                    client.application.commands.set([])
                    client.guilds.cache.get(guild.id)?.commands.set(commands)
                })
                console.log("aktif")
            } catch (error) {
                console.log(error)
            }
        
    });


};