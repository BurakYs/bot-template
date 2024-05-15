const { Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');
const config = require('@/config');

module.exports = {
    name: Events.GuildCreate,
    load: true,
    run: async (client, guild) => {
        const owner = client.users.cache.get(guild.owner) || await client.users.fetch(guild.ownerId).catch(() => null) || {};

        const embed = new EmbedBuilder()
            .setTitle('Guild Join')
            .setColor(Colors.Green)
            .setFields([
                { name: 'Name', value: `${guild.name} | ${guild.id}` },
                { name: 'Members', value: `Total: **${guild.memberCount}**` },
                { name: 'Owner', value: `${owner.globalName} | ${guild.ownerId}` },
                { name: 'Total Guilds', value: `${client.guilds.cache.size}` }
            ])
            .setTimestamp(guild.createdAt)
            .setThumbnail(guild.iconURL() ? guild.iconURL() : null);

        const leaveRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Leave')
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId(`LeaveGuild:${guild.id}`)
            );

        return await client.channels.cache.get(config.channels.botLog)?.send({
            embeds: [embed], components: [leaveRow]
        });
    }
};