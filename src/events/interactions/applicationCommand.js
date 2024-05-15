const { EmbedBuilder, resolveColor } = require('discord.js');
const { getTranslations } = require('@/helpers/functions');
const config = require('@/config');

module.exports = {
    name: 'applicationCommand',
    load: false,
    run: async (client, interaction) => {
        const cmd = client.commands.find(x => x.name === interaction.commandName);
        if (!cmd) return;

        const translations = getTranslations(interaction, 'standard');
        const permissions = getTranslations(interaction, 'permissions');

        const commandData = cmd.match(interaction);

        if (commandData.ownerOnly === true && !config.bot.admins.includes(interaction.user.id)) return;
        if (commandData.dmOnly === true && interaction.guild) return interaction.error({ description: translations.commandDMOnly });
        if (commandData.guildOnly === true && !interaction.guild) return interaction.error({ description: translations.commandGuildOnly });
        if (commandData.disabled && !config.bot.admins.includes(interaction.user.id)) return interaction.error({ description: translations.commandDisabled });
        if (commandData.supportServerOnly && ![config.guilds.supportServer.id, config.guilds.test.id].includes(interaction.guild?.id)) return interaction.error({ description: translations.commandSupportServerOnly.change({ support: config.guilds.supportServer.invite }) });
        if (commandData.memberPermission && !interaction.member.permissions.has(commandData.memberPermission)) {
            const permission = permissions[commandData.memberPermission] || commandData.memberPermission;

            return interaction.error({ description: translations.commandUserMissingPerms.change({ permissions: `\`${permission}\`` }) });
        }
        if (commandData.botPermission && !interaction.guild.members.me.permissions.has(commandData.botPermission)) {
            const permission = permissions[commandData.botPermission] || commandData.botPermission;

            return interaction.error({ description: translations.commandBotMissingPerms.change({ permissions: `\`${permission}\`` }) });
        }

        try {
            const commandTranslations = getTranslations(interaction, `commands.${interaction.commandName}`);
            await cmd.run({ client, interaction, translations: commandTranslations });
        } catch (error) {
            if (error) {
                if (interaction.commandName !== 'eval') {
                    if (error instanceof Error && ['unknown interaction', 'interaction has already been acknowledged'].includes(error.message?.toLowerCase())) return;

                    await client.channels.cache.get(config.channels.errorLog)?.send({
                        content: `<@&${config.roles.errorPings}>`,
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Error')
                                .setColor(resolveColor('Red'))
                                .setDescription(`
\`Server:\` ${interaction.guild?.name || 'DM'} | ${interaction.guild?.id || 'DM'}
\`Channel:\` ${interaction.channel?.name || 'DM'} ${interaction.channel?.id || 'DM'}
\`User:\` ${interaction.user.tag} | ${interaction.user.id}
\`Command:\` ${interaction.commandName}
        
\`Error:\` \`\`\`js\n${error.toString().slice(0, 3900)}\`\`\` 
`)
                        ]
                    });
                }

                logger.error(error);
                return interaction.error({
                    description: translations.unexpectedErrorOccurred.change({ support: config.guilds.supportServer.invite }),
                    ephemeral: true
                });
            }
        }
    }
};