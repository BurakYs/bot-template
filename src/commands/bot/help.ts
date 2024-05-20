import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { CommandConfig } from '@/interfaces/CommandData';
import { RunFunctionOptions } from '@/types';
import config from '@/config';

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
    } as CommandConfig,
    run: async ({ client, interaction, translations }: RunFunctionOptions) => {
        const commandName = interaction.options.getString('command')?.split(' ')[0];
        const command = commandName ? client.commands.find(x => x.data.name.toLowerCase() === commandName.toLowerCase()) : null;

        const embed = new EmbedBuilder()
            .setTitle(translations.embed.title)
            .setColor(config.embedColors.default)
            .setThumbnail(interaction.client.user.displayAvatarURL());

        if (commandName) {
            if (!command || command.config.ownerOnly) return interaction.error({ description: translations.commandNotFound.change({ name: `\`${commandName}\`` }) });

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
                .setDescription(translations.embed.description.change({ name: interaction.client.user.username }))
                .setFields([
                    {
                        name: '> ' + translations.links,
                        value: `
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
};