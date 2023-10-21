const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Ping Pong"),
    async run({ client, interaction }) {
        return interaction.reply({ content: `${client.ws.ping}ms` })
    }
}