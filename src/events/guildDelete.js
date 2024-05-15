const { Events, EmbedBuilder, Colors } = require('discord.js');
const config = require('@/config');

module.exports = {
    name: Events.GuildDelete,
    load: true,
    run: async (client, guild) => {
        await client.setPresence();

        const owner = client.users.cache.get(guild.owner) || await client.users.fetch(guild.ownerId).catch(() => null) || {};
        const embed = new EmbedBuilder()
            .setTitle('Guild Leave')
            .setColor(Colors.Red)
            .setFields([
                { name: 'Name', value: `${guild.name} | ${guild.id}` },
                { name: 'Members', value: `Total: **${guild.memberCount}**` },
                { name: 'Owner', value: `${owner.globalName} | ${guild.ownerId}` },
                { name: 'Total Guilds', value: `${client.guilds.cache.size}` }
            ])
            .setTimestamp(guild.createdAt)
            .setThumbnail(guild.iconURL() ? guild.iconURL() : null);

        return await client.channels.cache.get(config.channels.botLog)?.send({
            embeds: [embed]
        });
    }
};