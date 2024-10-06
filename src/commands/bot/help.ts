import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import config from '@/config';
import changeVariables from '@/utils/changeVariables';

import type { CommandData } from '@/types';

export default {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View information about the bot and its commands')
    .addStringOption(o => o
      .setName('command')
      .setDescription('The command you want to get information about')
      .setRequired(false)),
  config: {
    category: 'Bot'
  },
  run: async ({ client, interaction, translations }) => {
    const commandName = interaction.options.getString('command')?.split(' ')[0];
    const command = commandName && client.commands.find(x => x.data.name.toLowerCase() === commandName.toLowerCase());

    const embed = new EmbedBuilder()
      .setTitle(translations.embed.title)
      .setColor(config.embedColors.default)
      .setThumbnail(client.user.displayAvatarURL());

    if (commandName) {
      if (!command || command.config.botAdminOnly) return await interaction.error({ description: changeVariables(translations.commandNotFound, { name: `\`${commandName}\`` }) });

      embed
        .setDescription(command.data.description)
        .setFields([
          {
            name: '> ' + translations.info,
            value: `
${translations.command}: ${client.commandMentions[command.data.name] || command.data.name}
${translations.category}: ${command.config.category}
`
          }
        ]);
    } else {
      embed
        .setDescription(changeVariables(translations.embed.description, { name: client.user.username }))
        .setFields([
          {
            name: '> ' + translations.links,
            value: `
🛠️ [${translations.supportServer}](${config.guilds.supportServer.invite})
🔗 [${translations.inviteLink}](${client.getInviteURL()})
`
          }
        ])
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() });
    }

    await interaction.reply({
      embeds: [embed]
    });
  }
} satisfies CommandData;