import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import config from '@/config';

export default new SlashCommandBuilder()
    .setName('help')
    .setDescription('View information about the bot and its commands')
    .setCategory('Bot')
    .addStringOption(option =>
        option.setName('command')
            .setDescription('The command you want to get information about')
            .setRequired(false))
    .setRun(async ({ client, interaction, translations }) => {
        const commandName = interaction.options.getString('command')?.split(' ')[0];
        const command = commandName ? client.commands.find(x => x.name.toLowerCase() === commandName.toLowerCase()) || client.commands.filter(x => !x.ownerOnly && x.name_localizations).find(x => Object.values(x.name_localizations || {}).includes(commandName)) : null;
        let embed;

        if (commandName) {
            if (!command || command.ownerOnly) return interaction.error({ description: translations.commandNotFound.change({ name: `\`${commandName}\`` }) });

            embed = new EmbedBuilder()
                .setTitle(commandName.title())
                .setColor(config.embedColors.default)
                .setDescription(command.description)
                .addFields(
                    {
                        name: '> ' + translations.info,
                        value: `
${translations.command}: ${client.commandMentions[command.name] || command.name}
${translations.category}: ${command?.category}
`
                    }
                )
                .setThumbnail(interaction.client.user.displayAvatarURL());
        } else {
            embed = new EmbedBuilder()
                .setTitle(translations.embed.title)
                .setDescription(translations.embed.description.change({ name: interaction.client.user.username }))
                .addFields(
                    {
                        name: '> ' + translations.links, value: `
🛠️ [${translations.supportServer}](${config.guilds.supportServer.invite})
🔗 [${translations.inviteLink}](${config.bot.invite})
`
                    }
                )
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
                .setColor(config.embedColors.default);
        }

        await interaction.reply({
            embeds: [embed]
        });
    }
    );