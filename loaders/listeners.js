const { EmbedBuilder, resolveColor, InteractionType, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityType } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');

const handlers = {
    interactions: {
        applicationCommand: require('../events/interactions/applicationCommand.js'),
        button: require('../events/interactions/button.js'),
        modal: require('../events/interactions/modal.js'),
        autoComplete: require('../events/interactions/autoComplete.js')
    }
};

module.exports = async (client) => {
    client.on(Events.ClientReady, async () => {
        logger.info(`Logged in as ${client.user.tag}`);

        moment.locale(client.config.bot.defaultLanguage);
        await setPresence();

        setInterval(async () => {
            await setPresence();
        }, 60000);
    });

    client.on(Events.InteractionCreate, async interaction => {
        if (interaction.type === InteractionType.ApplicationCommand) return await handlers.interactions.applicationCommand.run(client, interaction);
        if (interaction.isButton()) return await handlers.interactions.button.run(client, interaction);
        if (interaction.type === InteractionType.ModalSubmit) return await handlers.interactions.modal.run(client, interaction);
        if (interaction.type === InteractionType.ApplicationCommandAutocomplete) return await handlers.interactions.autoComplete.run(client, interaction);
    });

    client.on(Events.GuildCreate, async guild => {
        await setPresence();

        const owner = await client.users.fetch(guild.ownerId).catch(() => null);
        const embed = new EmbedBuilder()
            .setTitle('Guild Join')
            .setColor(client.config.embedColors.success)
            .addFields(
                { name: 'Name', value: `${guild.name} | ${guild.id}` },
                { name: 'Members', value: `Total: **${guild.memberCount}**` },
                { name: 'Owner', value: `${owner?.discriminator === '0' ? owner.username : owner.tag} | ${guild.ownerId}` },
                { name: 'Total Guilds', value: `${client.guilds.cache.size}` })
            .setTimestamp(guild.createdAt)
            .setThumbnail(guild.iconURL() ? guild.iconURL() : null);

        return await client.channels.cache.get(client.config.channels.botLog)?.send({
            embeds: [embed], components: [new ActionRowBuilder().addComponents(new ButtonBuilder()
                .setLabel('Leave')
                .setStyle(ButtonStyle.Danger)
                .setCustomId(`LeaveGuild:${guild.id}`))]
        });
    });

    client.on(Events.GuildDelete, async guild => {
        await setPresence();

        const owner = await client.users.fetch(guild.ownerId).catch(() => null);
        const embed = new EmbedBuilder()
            .setTitle('Guild Leave')
            .setColor(resolveColor('Red'))
            .addFields(
                { name: 'Name', value: `${guild.name} | ${guild.id}` },
                { name: 'Members', value: `Total: **${guild.memberCount}**` },
                { name: 'Owner', value: `${owner?.discriminator === '0' ? owner.username : owner.tag} | ${guild.ownerId}` },
                { name: 'Total Guilds', value: `${client.guilds.cache.size}` })
            .setTimestamp(guild.createdAt)
            .setThumbnail(guild.iconURL() ? guild.iconURL() : null);

        return await client.channels.cache.get(client.config.channels.botLog)?.send({
            embeds: [embed]
        });
    });

    async function setPresence() {
        const { activity, status } = client.config.presence;
        const activityName = activity.replaceAll('{u}', client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString()).replaceAll('{s}', client.guilds.cache.size);

        return client.user.setPresence({
            activities: [{
                name: activityName,
                type: ActivityType.Custom,
                state: activityName
            }],
            status: status
        });
    }
};