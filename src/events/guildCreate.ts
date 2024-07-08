import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, EmbedBuilder, Events, Guild } from 'discord.js';
import Client from '@/loaders/base';
import config from '@/config';

export default {
  name: Events.GuildCreate,
  load: true,
  run: async (client: Client, guild: Guild) => {
    client.setPresence();

    const owner = client.users.cache.get(guild.ownerId) || await client.users.fetch(guild.ownerId).catch(() => null);

    const embed = new EmbedBuilder()
      .setTitle('Guild Join')
      .setColor(Colors.Green)
      .setFields([
        { name: 'Name', value: `${guild.name} | ${guild.id}` },
        { name: 'Members', value: `Total: **${guild.memberCount}**` },
        { name: 'Owner', value: `${owner?.globalName} | ${guild.ownerId}` },
        { name: 'Total Guilds', value: `${client.guilds.cache.size}` }
      ])
      .setTimestamp(guild.createdAt)
      .setThumbnail(guild.iconURL() ? guild.iconURL() : null);

    const leaveRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(
        new ButtonBuilder()
          .setLabel('Leave')
          .setStyle(ButtonStyle.Danger)
          .setCustomId(`LeaveGuild:${guild.id}`)
      );

    const logChannel = client.channels.cache.get(config.channels.botLog);
    if (logChannel?.isTextBased()) logChannel.send({
      embeds: [embed], components: [leaveRow]
    });
  }
};