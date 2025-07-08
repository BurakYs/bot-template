import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import config from '@/config';

import type { CommandData } from '@/types';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('View information about the bot and its commands')
        .addStringOption((o) => o.setName('command').setDescription('The command you want to get information about')),
    config: {
        category: 'Bot'
    },
    run: async ({ client, interaction }) => {
        const commandName = interaction.options.getString('command')?.split(' ')[0];
        const command = commandName && client.commands.find((x) => x.data.name.toLowerCase() === commandName.toLowerCase());

        const embed = new EmbedBuilder()
            .setTitle(interaction.translate('commands.help.embed.title'))
            .setColor(config.embedColors.default)
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setThumbnail(client.user.displayAvatarURL());

        if (commandName) {
            if (!command || command.config.botAdminsOnly) return await interaction.error(interaction.translate('commands.help.commandNotFound', { name: `\`${commandName}\`` }));

            embed.setDescription(command.data.description).setFields([
                {
                    name: interaction.translate('commands.help.info.title'),
                    value: `
${interaction.translate('commands.help.info.description')}: ${command.data.description}
${interaction.translate('commands.help.info.category')}: ${command.config.category}
`
                }
            ]);
        } else {
            embed.setDescription(interaction.translate('commands.help.embed.description', { name: client.user.username })).setFields([
                {
                    name: interaction.translate('commands.help.links.title'),
                    value: `
🛠 [${interaction.translate('commands.help.links.supportServer')}](${config.guilds.supportServer.invite})
🔗 [${interaction.translate('commands.help.links.invite')}](${client.getInviteURL()})
`
                }
            ]);
        }

        await interaction.reply({
            embeds: [embed]
        });
    }
} satisfies CommandData;
