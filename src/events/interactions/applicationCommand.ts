import { EmbedBuilder, resolveColor } from 'discord.js';
import { getTranslations } from '@/helpers/functions';
import { Interaction } from '@/interfaces';
import Client from '@/loaders/base';
import config from '@/config';

export default {
    name: 'applicationCommand',
    load: false,
    run: async (client: Client, interaction: Interaction) => {
        const cmd = client.commands.find(x => x.name === interaction.commandName);
        if (!cmd) return;

        const translations = getTranslations(interaction, 'standard');
        const permissions = getTranslations(interaction, 'permissions');

        const commandData = cmd.match(interaction);

        if (commandData.ownerOnly === true && !config.bot.admins.includes(interaction.user.id)) return;
        if (commandData.dmOnly === true && interaction.guild) return interaction.error({ description: translations.commandDMOnly });
        if (commandData.guildOnly === true && !interaction.guild) return interaction.error({ description: translations.commandGuildOnly });
        if (commandData.disabled && !config.bot.admins.includes(interaction.user.id)) return interaction.error({ description: translations.commandDisabled });
        if (commandData.supportServerOnly && ![config.guilds.supportServer.id, config.guilds.test].includes(interaction.guild?.id || '')) return interaction.error({ description: translations.commandSupportServerOnly.change({ support: config.guilds.supportServer.invite }) });
        // @ts-ignore
        if (interaction.inGuild() && commandData.memberPermission && !interaction.member?.permissions?.has(commandData.memberPermission)) {
            const permission = permissions[commandData.memberPermission] || commandData.memberPermission;

            return interaction.error({ description: translations.commandUserMissingPerms.change({ permissions: `\`${permission}\`` }) });
        }
        if (interaction.inGuild() && commandData.botPermission && !interaction.guild?.members?.me?.permissions.has(commandData.botPermission)) {
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

                    const channel = client.channels.cache.get(config.channels.botLog);
                    if (channel?.isTextBased()) await channel.send({
                        content: `<@&${config.roles.errorPings}>`,
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Error')
                                .setColor(resolveColor('Red'))
                                .setDescription(`
\`Server:\` ${interaction.guild?.name || 'DM'} | ${interaction.guild?.id || 'DM'}
\`Channel:\` ${interaction.inGuild() ? interaction.guild?.name : 'DM'} ${interaction.channel?.id || 'DM'}
\`User:\` ${interaction.user.globalName} | ${interaction.user.id}
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