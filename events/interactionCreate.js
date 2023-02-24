const { InteractionType, EmbedBuilder, resolveColor } = require("discord.js");
module.exports = {
    name: 'interactionCreate',
    async run(client, interaction) {
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = client.slashcmds.get(interaction.commandName);
            if (!command) return;
            if (client.commands.find(x => x.name === interaction.commandName)?.owner === true && !client.config.owners.includes(interaction.user.id)) return;
            if (client.commands.find(x => x.name === interaction.commandName)?.dm === false && !interaction.guild) return;
            if (client.commands.find(x => x.name === interaction.commandName).reqPermMember !== "NONE") {
                const reqPermMember = client.commands.find(x => x.name === interaction.commandName).reqPermMember.replace("Administrator", "Administrator").replace("ManageChannels", "ManageChannels").replace("ManageRoles", "Manage Roles").replace("Manageinteractions", "Manage interactions").replace("ManageGuild", "Manage Server").replace("ModerateMembers", "Timeout Members").replace("BanMembers", "Ban Members").replace("KickMembers", "Kick Members").replace("ManageNicknames", "Manage Nicknames")
                if (!interaction.member.permissions.has(client.commands.find(x => x.name === interaction.commandName).reqPermMember)) return interaction.reply({
                    embeds: [new EmbedBuilder().setTitle("Missing Permissions").setColor(resolveColor("Red")).setDescription(`You don't have this permission: \`${reqPermMember}\``)]
                })
            }
            if (client.commands.find(x => x.name === interaction.commandName).reqPermBot !== "NONE") {
                const reqPermBot = client.commands.find(x => x.name === interaction.commandName).reqPermBot.replace("Administrator", "Administrator").replace("ManageChannels", "ManageChannels").replace("ManageRoles", "Manage Roles").replace("Manageinteractions", "Manage interactions").replace("ManageGuild", "Manage Server").replace("ModerateMembers", "Timeout Members").replace("BanMembers", "Ban Members").replace("KickMembers", "Kick Members").replace("ManageNicknames", "Manage Nicknames")
                if (!interaction.guild.members.me.permissions.has(client.commands.find(x => x.name === interaction.commandName).reqPermBot)) return interaction.reply({
                    embeds: [new EmbedBuilder().setTitle("Missing Permissions").setColor(resolveColor("Red")).setDescription(`I don't have this permission: \`${reqPermBot}\``)]
                })
            }


            try {
                await command.run(interaction)
            } catch (error) {
                if (error) {
                    return console.log(error)
                }
            }
        }
    },
};
