import { Colors, EmbedBuilder, PermissionResolvable } from 'discord.js';
import { CommandConfig } from '@/interfaces/CommandData';
import { CommandData, Interaction, ParsedCommandData } from '@/interfaces';
import Client from '@/loaders/base';
import utils from '@/helpers';
import config from '@/config';

export default {
    name: 'applicationCommand',
    load: false,
    run: async (client: Client, interaction: Interaction) => {
        const cmd = client.commands.find(x => x.data.name === interaction.commandName);
        if (!cmd) return;

        const commandData = matchCommandData(cmd, interaction);

        const translations = utils.getTranslations(interaction, 'general');
        const permissions = utils.getTranslations(interaction, 'permissions');
        const isSupportServer = [config.guilds.supportServer.id, config.guilds.test].includes(interaction.guild?.id || '');
        const isDeveloper = config.bot.developers.includes(interaction.user.id);

        if (commandData.ownerOnly && !isDeveloper) return;
        if (commandData.dmOnly && interaction.guild) return interaction.error({ description: translations.commandDMOnly });
        if (commandData.guildOnly && !interaction.guild) return interaction.error({ description: translations.commandGuildOnly });
        if (commandData.disabled && !isDeveloper) return interaction.error({ description: translations.commandDisabled });
        if (commandData.supportServerOnly && !isSupportServer) return interaction.error({ description: translations.commandSupportServerOnly.change({ support: config.guilds.supportServer.invite }) });

        // TODO: Here
        if (interaction.inCachedGuild() && commandData.memberPermission && !interaction.member.permissions.has(commandData.memberPermission as PermissionResolvable)) {
            const permission = permissions[commandData.memberPermission as string] || commandData.memberPermission;

            return interaction.error({ description: translations.commandUserMissingPerms.change({ permissions: `\`${permission}\`` }) });
        }
        if (interaction.inCachedGuild() && commandData.botPermission && !interaction.guild.members.me?.permissions.has(commandData.botPermission as PermissionResolvable)) {
            const permission = permissions[commandData.botPermission as string] || commandData.botPermission;

            return interaction.error({ description: translations.commandBotMissingPerms.change({ permissions: `\`${permission}\`` }) });
        }

        try {
            const commandTranslations = utils.getTranslations(interaction, `commands.${interaction.commandName}`);
            await commandData.run({ client, interaction, translations: commandTranslations });
        } catch (error) {
            if (error) {
                if (interaction.commandName !== 'eval') {
                    if (error instanceof Error && ['unknown interaction', 'interaction has already been acknowledged'].includes(error.message?.toLowerCase())) return;

                    const channel = client.channels.cache.get(config.channels.botLog);
                    if (channel?.isTextBased()) await channel.send({
                        content: `<@&${config.roles.errorPings}>`,
                        embeds: [new EmbedBuilder()
                            .setTitle('Error')
                            .setColor(Colors.Red)
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

function matchCommandData(command: CommandData, interaction: Interaction): ParsedCommandData {
    const matchedCommand: ParsedCommandData = {
        ...command.data,
        ...command.config,
        run: command.run
    };

    const variableFields: (keyof CommandConfig)[] = ['tags', 'guildOnly', 'ownerOnly', 'dmOnly', 'memberPermission', 'botPermission', 'disabled', 'supportServerOnly'];
    const subcommandGroup = interaction.options.getSubcommandGroup(false);
    const subcommand = interaction.options.getSubcommand(false);
    const optionsText = [subcommandGroup, subcommand].filter(Boolean).join(' ');

    for (const [key, value] of Object.entries(command.config)) {
        if (!variableFields.includes(key as keyof CommandConfig)) continue;

        if (!Array.isArray(value) && typeof value === 'object') {
            if (value[optionsText] != null) {
                // @ts-expect-error - This is fine
                matchedCommand[key] = value[optionsText];
            } else {
                // @ts-expect-error - This is fine
                matchedCommand[key] = null;
            }
        }
    }

    return matchedCommand;
}