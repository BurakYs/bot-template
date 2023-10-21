const { InteractionType, EmbedBuilder, resolveColor } = require("discord.js");
module.exports = {
    name: 'interactionCreate',
    async run(client, interaction) {
<<<<<<< HEAD
=======
        if (interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
            const command = client.contextcmds.get(interaction.commandName);
            if (!command) return;
            try {
                await command.run({ client, interaction })
            } catch (error) {
                if (error) {
                    client.channels.cache.get(client.config.channels.errorLog)?.send({
                        content: `<@&${client.config.roles.errorPings}>`,
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Error (Context)")
                                .setColor(resolveColor("Red"))
                                .setDescription(`
\`Server:\` ${interaction.guild?.name || "DM"} | ${interaction.guildId || "DM"}
\`Channel:\` ${interaction.channel?.name || "DM"} ${interaction.channel?.id || "DM"}
\`User:\` ${interaction.user.tag} | ${interaction.user.id}
\`Command:\` ${interaction.commandName}
        
\`Error:\` \`\`\`js\n${error.toString().slice(0, 3000)}\`\`\` 
        `)
                        ]
                    })
                    console.error(error)
                    return client.error(interaction, { description: `There was an error while executing this command! Error has been submitted to developers. Join our [support server](${client.config.guilds.supportServer.invite}) for advanced help.`, ephemeral: true })
                }
            }
        }
>>>>>>> 94a3c68f27bd8ae856f00c3d1bf666a54dacbde4
        if (interaction.type === InteractionType.ApplicationCommand) {
            const command = client.slashcmds.get(interaction.commandName);
            if (!command) return;
            const cmd = client.commands.find(x => x.name === interaction.commandName)
            if (cmd?.owner === true && !client.config.bot.admins.includes(interaction.user.id)) return;
            if (cmd?.dm === false && !interaction.guild) return;
            if (cmd.reqPermMember) {
                const reqPermMember = cmd.reqPermMember.replace("Administrator", "Administrator").replace("ManageChannels", "Manage Channels").replace("ManageRoles", "Manage Roles").replace("ManageMessages", "Manage Messages").replace("ManageGuild", "Manage Server").replace("ModerateMembers", "Timeout Members").replace("BanMembers", "Ban Members").replace("KickMembers", "Kick Members").replace("ManageNicknames", "Manage Nicknames")
                if (!interaction.member.permissions.has(cmd.reqPermMember)) return client.error(interaction, { description: `You don't have this permission: \`${reqPermMember}\`` })
            }
            if (cmd.reqPermBot) {
                const reqPermBot = cmd.reqPermBot.replace("Administrator", "Administrator").replace("ManageChannels", "Manage Channels").replace("ManageRoles", "Manage Roles").replace("ManageMessages", "Manage Messages").replace("ManageGuild", "Manage Server").replace("ModerateMembers", "Timeout Members").replace("BanMembers", "Ban Members").replace("KickMembers", "Kick Members").replace("ManageNicknames", "Manage Nicknames")
                if (!interaction.guild.members.me.permissions.has(cmd.reqPermBot)) return client.error(interaction, { description: `I don't have this permission: \`${reqPermBot}\`` })
            }
            try {
                await command.run({ client, interaction })
            } catch (error) {
                if (error) {
                    client.channels.cache.get(client.config.channels.errorLog)?.send({
                        content: `<@&${client.config.roles.errorPings}>`,
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("Error (Slash)")
                                .setColor(resolveColor("Red"))
                                .setDescription(`
\`Server:\` ${interaction.guild?.name || "DM"} | ${interaction.guildId || "DM"}
\`Channel:\` ${interaction.channel?.name || "DM"} ${interaction.channel?.id || "DM"}
\`User:\` ${interaction.user.tag} | ${interaction.user.id}
\`Command:\` ${interaction.commandName}
        
\`Error:\` \`\`\`js\n${error.toString().slice(0, 3000)}\`\`\` 
        `)
                        ]
                    }).catch(() => { })

                    console.error(error)
<<<<<<< HEAD
                    return client.error(interaction, { descriotion: `There was an error while executing this command! Error has been submitted to developers. Join our [support server](${client.config.guilds.supportServer.invite}) for updates.` })
=======
                    return client.error(interaction, { description: `There was an error while executing this command! Error has been submitted to developers. Join our [support server](${client.config.guilds.supportServer.invite}) for advanced help.`, ephemeral: true })
>>>>>>> 94a3c68f27bd8ae856f00c3d1bf666a54dacbde4
                }
            }
        }
    },
};
