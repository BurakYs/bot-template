import { PermissionResolvable } from 'discord.js';
import utils from '@/helpers';
import config from '@/config';

import type { Client, CommandConfig, CommandData, EventData, Interaction, ParsedCommandData } from '@/types';

export default {
  name: 'applicationCommand',
  dontLoad: true,
  run: async (client: Client, interaction: Interaction) => {
    const cmd = client.commands.find(x => x.data.name === interaction.commandName);
    if (!cmd) return;

    const commandData = matchCommandData(cmd, interaction);
    console.log(commandData);

    const translations = utils.getTranslations(interaction, 'general');
    const permissions = utils.getTranslations(interaction, 'permissions');
    const isSupportServer = [config.guilds.supportServer.id, config.guilds.test].includes(interaction.guild?.id || '');
    const isAdmin = config.bot.admins.includes(interaction.user.id);

    if (commandData.botAdminOnly && !isAdmin) return await interaction.error({ description: translations.commandBotAdminOnly });
    if (commandData.dmOnly && interaction.guild) return await interaction.error({ description: translations.commandDMOnly });
    if (commandData.guildOnly && !interaction.guild) return await interaction.error({ description: translations.commandGuildOnly });
    if (commandData.disabled && !isAdmin) return await interaction.error({ description: translations.commandDisabled });
    if (commandData.supportServerOnly && !isSupportServer)
      return await interaction.error({ description: translations.commandSupportServerOnly.change({ support: config.guilds.supportServer.invite }) });

    if (interaction.inCachedGuild() && commandData.memberPermission && !interaction.member.permissions.has(commandData.memberPermission as PermissionResolvable)) {
      const permission = permissions[commandData.memberPermission as string] || commandData.memberPermission;

      return await interaction.error({ description: translations.commandUserMissingPerms.change({ permissions: `\`${permission}\`` }) });
    }
    if (interaction.inCachedGuild() && commandData.botPermission && !interaction.guild.members.me?.permissions.has(commandData.botPermission as PermissionResolvable)) {
      const permission = permissions[commandData.botPermission as string] || commandData.botPermission;

      return await interaction.error({ description: translations.commandBotMissingPerms.change({ permissions: `\`${permission}\`` }) });
    }

    try {
      const commandTranslations = utils.getTranslations(interaction, `commands.${interaction.commandName}`);
      await commandData.run({ client, interaction, translations: commandTranslations });
    } catch (error) {
      logger.error(error);
      await interaction.error({
        description: translations.unexpectedErrorOccurred.change({ support: config.guilds.supportServer.invite }),
        ephemeral: true
      });
    }
  }
} satisfies EventData;

function matchCommandData(command: CommandData, interaction: Interaction): ParsedCommandData {
  const matchedCommand: ParsedCommandData = {
    ...command.data,
    ...command.config,
    run: command.run
  };

  const variableFields: (keyof CommandConfig)[] = [
    'tags',
    'guildOnly',
    'botAdminOnly',
    'dmOnly',
    'memberPermission',
    'botPermission',
    'disabled',
    'supportServerOnly'
  ];

  const subcommandGroup = interaction.options.getSubcommandGroup(false);
  const subcommand = interaction.options.getSubcommand(false);
  const optionsText = [subcommandGroup, subcommand].filter(Boolean).join(' ');

  for (const [key, value] of Object.entries(command.config) as [keyof CommandConfig, Record<string, any>][]) {
    if (!variableFields.includes(key)) continue;

    const defaultValue = value['*'] ?? null;

    if (!Array.isArray(value) && typeof value === 'object') {
      matchedCommand[key] = value[optionsText] ?? defaultValue;
    }
  }

  return matchedCommand;
}