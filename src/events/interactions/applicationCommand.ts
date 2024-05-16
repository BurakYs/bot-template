import { EmbedBuilder, PermissionResolvable, resolveColor } from 'discord.js';
import utils from '@/helpers';
import { Interaction } from '@/interfaces';
import Client from '@/loaders/base';
import config from '@/config';

export default {
    name: 'applicationCommand',
    load: false,
    run: async (client: Client, interaction: Interaction) => {
        const cmd = client.commands.find(x => x.name === interaction.commandName);
        if (!cmd) return;

        const translations = utils.getTranslations(interaction, 'standard');
        const permissions = utils.getTranslations(interaction, 'permissions');

        const commandData = cmd.match(interaction);

        if (commandData.ownerOnly && !config.bot.developers.includes(interaction.user.id)) return;
        if (commandData.dmOnly && interaction.guild) return interaction.error({ description: translations.commandDMOnly });
        if (commandData.guildOnly && !interaction.guild) return interaction.error({ description: translations.commandGuildOnly });
        if (commandData.disabled && !config.bot.developers.includes(interaction.user.id)) return interaction.error({ description: translations.commandDisabled });
        if (commandData.supportServerOnly && (![config.guilds.supportServer.id, config.guilds.test].includes(interaction.guild?.id || ''))) return interaction.error({ description: translations.commandSupportServerOnly.change({ support: config.guilds.supportServer.invite }) });

        if (interaction.inCachedGuild() && commandData.memberPermission && !interaction.member.permissions.has(commandData.memberPermission as PermissionResolvable)) {
            const permission = permissions[commandData.memberPermission] || commandData.memberPermission;

            return interaction.error({ description: translations.commandUserMissingPerms.change({ permissions: `\`${permission}\`` }) });
        }
        if (interaction.inCachedGuild() && commandData.botPermission && !interaction.guild.members.me?.permissions.has(commandData.botPermission as PermissionResolvable)) {
            const permission = permissions[commandData.botPermission] || commandData.botPermission;

            return interaction.error({ description: translations.commandBotMissingPerms.change({ permissions: `\`${permission}\`` }) });
        }

        try {
            const commandTranslations = utils.getTranslations(interaction, `commands.${interaction.commandName}`);
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