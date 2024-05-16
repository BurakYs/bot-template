import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
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

        const embed = new EmbedBuilder()
            .setColor(config.embedColors.default)
            .setThumbnail(interaction.client.user.displayAvatarURL());

        if (commandName) {
            if (!command || command.ownerOnly) return interaction.error({ description: translations.commandNotFound.change({ name: `\`${commandName}\`` }) });

            embed
                .setTitle(commandName.title())
                .setDescription(command.description)
                .setFields([
                    {
                        name: '> ' + translations.info,
                        value: `
${translations.command}: ${client.commandMentions[command.name] || command.name}
${translations.category}: ${command?.category}
`
                    }
                ]);
        } else {
            embed
                .setTitle(translations.embed.title)
                .setDescription(translations.embed.description.change({ name: interaction.client.user.username }))
                .setFields([
                    {
                        name: '> ' + translations.links, value: `
🛠️ [${translations.supportServer}](${config.guilds.supportServer.invite})
🔗 [${translations.inviteLink}](${config.bot.invite})
`
                    }
                ])
                .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() });
        }

        await interaction.reply({
            embeds: [embed]
        });
    }
    );