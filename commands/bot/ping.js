const { SlashCommandBuilder } = require("discord.js");
module.exports = {
    command: {
        reqPermMember: "ManageGuild",
        reqPermBot: "BanMembers"
        /* Yetki Gerekmiyorsa
        reqPermMember: "NONE",
        reqPermBot: "NONE"*/
    },
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Ping Pong!"),
    async run(interaction) {
        interaction.reply({ content: `${client.ws.ping}ms` })
    }
}
