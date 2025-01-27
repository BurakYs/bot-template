import { type ChatInputCommandInteraction } from 'discord.js';
import { changeVariables, getTranslations } from '@/utils';
import config from '@/config';

import type { Client, CommandConfig, CommandData, EventData, ResolvedCommandData } from '@/types';

export default {
  name: 'applicationCommand',
  dontLoad: true,
  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    const cmd = client.commands.find(x => x.data.name === interaction.commandName);
    if (!cmd) return;

    const commandData = resolveCommandData(cmd, interaction);
    const commandErrors = getTranslations(interaction, 'commandErrors');
    const permissions = getTranslations(interaction, 'permissions');

    const isSupportServer = [config.guilds.supportServer.id, config.guilds.test].includes(interaction.guild?.id || '');
    const isAdmin = config.bot.admins.includes(interaction.user.id);

    if (commandData.botAdminOnly && !isAdmin) return await interaction.error({ description: commandErrors.botAdminOnly });
    if (commandData.dmOnly && interaction.guild) return await interaction.error({ description: commandErrors.dmOnly });
    if (commandData.guildOnly && !interaction.guild) return await interaction.error({ description: commandErrors.guildOnly });
    if (commandData.disabled) return await interaction.error({ description: commandErrors.disabled });
    if (commandData.supportServerOnly && !isSupportServer)
      return await interaction.error({ description: changeVariables(commandErrors.supportServerOnly, { support: config.guilds.supportServer.invite }) });

    if (interaction.inCachedGuild()) {
      const missingMemberPermissions = commandData.requiredMemberPermissions?.filter(p => !interaction.member.permissions.has(p));
      const missingBotPermissions = commandData.requiredBotPermissions?.filter(p => !interaction.guild.members.me?.permissions.has(p));

      if (missingMemberPermissions?.length) {
        const missingPermissions = missingMemberPermissions.map(p => `\`${permissions[p.toString()] || p.toString()}\``).join(', ');
        return await interaction.error({ description: changeVariables(commandErrors.userMissingPermissions, { permissions: missingPermissions }) });
      }

      if (missingBotPermissions?.length) {
        const missingPermissions = missingBotPermissions.map(p => `\`${permissions[p.toString()] || p.toString()}\``).join(', ');
        return await interaction.error({ description: changeVariables(commandErrors.botMissingPermissions, { permissions: missingPermissions }) });
      }
    }

    try {
      const commandTranslations = getTranslations(interaction, `commands.${interaction.commandName}`);
      return await commandData.run({ client, interaction, translations: commandTranslations });
    } catch (error) {
      global.logger.error(error);

      return await interaction.error({
        description: changeVariables(commandErrors.unexpectedErrorOccurred, { support: config.guilds.supportServer.invite }),
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
    const [key, value] = entries as [keyof CommandConfig, any];

    if (!Array.isArray(value) && typeof value === 'object') {
      resolvedCommand[key] = value[optionsText] ?? value['*'] ?? null;
    }
  }

  return resolvedCommand as ResolvedCommandData;
}