import config from '@/config';
import type { ChatInputCommandInteraction } from 'discord.js';

import type { Client, CommandConfig, CommandData, EventData, ResolvedCommandData } from '@/types';

export default {
    name: 'applicationCommand',
    dontLoad: true,
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const cmd = client.commands.find((x) => x.data.name === interaction.commandName);
        if (!cmd) return;

        const commandData = resolveCommandData(cmd, interaction);

        const isSupportServer = [config.guilds.supportServer.id, config.guilds.test].includes(interaction.guild?.id || '');
        const isAdmin = config.bot.admins.includes(interaction.user.id);

        if (commandData.botAdminsOnly && !isAdmin) return await interaction.error({ description: interaction.translate('commandErrors.botAdminsOnly') });
        if (commandData.disabled) return await interaction.error({ description: interaction.translate('commandErrors.disabled') });
        if (commandData.dmOnly && interaction.guild) return await interaction.error({ description: interaction.translate('commandErrors.dmOnly') });
        if (commandData.guildOnly && !interaction.guild) return await interaction.error({ description: interaction.translate('commandErrors.guildOnly') });
        if (commandData.supportServerOnly && !isSupportServer)
            return await interaction.error({ description: interaction.translate('commandErrors.supportServerOnly', { support: config.guilds.supportServer.invite }) });

        if (interaction.inCachedGuild()) {
            const missingMemberPermissions = commandData.requiredMemberPermissions?.filter((p) => !interaction.member.permissions.has(p));
            const missingBotPermissions = commandData.requiredBotPermissions?.filter((p) => !interaction.guild.members.me?.permissions.has(p));
            const permissions: Record<string, string> = interaction.translate('permissions', { returnObjects: true });

            if (missingMemberPermissions?.length) {
                const missingPermissions = missingMemberPermissions.map((p) => `\`${permissions[p.toString()] || p.toString()}\``).join(', ');
                return await interaction.error({ description: interaction.translate('commandErrors.userMissingPermissions', { permissions: missingPermissions }) });
            }

            if (missingBotPermissions?.length) {
                const missingPermissions = missingBotPermissions.map((p) => `\`${permissions[p.toString()] || p.toString()}\``).join(', ');
                return await interaction.error({ description: interaction.translate('commandErrors.botMissingPermissions', { permissions: missingPermissions }) });
            }
        }

        try {
            return await commandData.run({ client, interaction });
        } catch (error) {
            global.logger.error(error);

            return await interaction.error({
                description: interaction.translate('commandErrors.unexpectedErrorOccurred', { support: config.guilds.supportServer.invite }),
                ephemeral: true
            });
        }
    }
} satisfies EventData;

function resolveCommandData(command: CommandData, interaction: ChatInputCommandInteraction) {
    const resolvedCommand = {
        ...command.data,
        ...command.config,
        run: command.run
    };

    const subcommandGroup = interaction.options.getSubcommandGroup(false);
    const subcommand = interaction.options.getSubcommand(false);
    const optionsText = [subcommandGroup, subcommand].filter(Boolean).join(' ');

    for (const entries of Object.entries(command.config)) {
        // biome-ignore lint/suspicious/noExplicitAny: x
        const [key, value] = entries as [keyof CommandConfig, any];

        if (!Array.isArray(value) && value != null && typeof value === 'object') {
            resolvedCommand[key] = value[optionsText] ?? value['*'] ?? null;
        }
    }

    return resolvedCommand as ResolvedCommandData;
}
