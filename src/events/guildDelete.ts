import { Colors, EmbedBuilder, Events, Guild } from 'discord.js';
import Client from '@/loaders/base';
import config from '@/config';

export default {
    name: Events.GuildDelete,
    load: true,
    run: async (client: Client, guild: Guild) => {
        client.setPresence();

        const owner = client.users.cache.get(guild.ownerId) || await client.users.fetch(guild.ownerId).catch(() => null);
        const embed = new EmbedBuilder()
            .setTitle('Guild Leave')
            .setColor(Colors.Red)
            .setFields([
                { name: 'Name', value: `${guild.name} | ${guild.id}` },
                { name: 'Members', value: `Total: **${guild.memberCount}**` },
                { name: 'Owner', value: `${owner?.globalName} | ${guild.ownerId}` },
                { name: 'Total Guilds', value: `${client.guilds.cache.size}` }
            ])
            .setTimestamp(guild.createdAt)
            .setThumbnail(guild.iconURL() ? guild.iconURL() : null);

        const logChannel = client.channels.cache.get(config.channels.botLog);
        if (logChannel?.isTextBased()) logChannel.send({
            embeds: [embed]
        });
    }
};