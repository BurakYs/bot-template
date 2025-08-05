import type { ChatInputCommandInteraction } from 'discord.js';
import config from '@/config';
import CommandLoader from '@/loaders/command';
import type { CommandConfig, CommandData, ResolvedCommandData } from '@/types';
import defineEvent from '@/utils/defineEvent';

export default defineEvent({
    name: 'applicationCommand',
    dontLoad: true,
    run: async (client, interaction: ChatInputCommandInteraction) => {
        const cmd = CommandLoader.commands.find((x) => x.data.name === interaction.commandName);
        if (!cmd) return;

        const commandData = resolveCommandData(cmd, interaction);

        const isSupportServer = interaction.guild?.id === config.guilds.supportServer.id || interaction.guild?.id === config.guilds.test;
        const isAdmin = config.bot.admins.includes(interaction.user.id);

        if (commandData.botAdminsOnly && !isAdmin) return interaction.error(interaction.translate('commandErrors.botAdminsOnly'));
        if (commandData.disabled) return interaction.error(interaction.translate('commandErrors.disabled'));
        if (commandData.dmOnly && interaction.guild) return interaction.error(interaction.translate('commandErrors.dmOnly'));
        if (commandData.guildOnly && !interaction.guild) return interaction.error(interaction.translate('commandErrors.guildOnly'));
        if (commandData.supportServerOnly && !isSupportServer)
            return interaction.error(interaction.translate('commandErrors.supportServerOnly', { support: config.guilds.supportServer.invite }));

        if (interaction.inCachedGuild()) {
            const missingMemberPermissions = commandData.memberPermissions?.filter((p) => !interaction.member.permissions.has(p));
            const missingBotPermissions = commandData.botPermissions?.filter((p) => !interaction.guild.members.me?.permissions.has(p));
            const permissions: Record<string, string> = interaction.translate('permissions', { returnObjects: true });

            if (missingMemberPermissions?.length) {
                const missingPermissions = missingMemberPermissions.map((p) => `\`${permissions[p.toString()] || p.toString()}\``).join(', ');
                return interaction.error(interaction.translate('commandErrors.userMissingPermissions', { permissions: missingPermissions }));
            }

            if (missingBotPermissions?.length) {
                const missingPermissions = missingBotPermissions.map((p) => `\`${permissions[p.toString()] || p.toString()}\``).join(', ');
                return interaction.error(interaction.translate('commandErrors.botMissingPermissions', { permissions: missingPermissions }));
            }
        }

        try {
            await commandData.run({ client, interaction });
        } catch (error) {
            global.logger.error(error);

            await interaction.error(interaction.translate('commandErrors.unexpectedErrorOccurred'));
        }
    }
});

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
