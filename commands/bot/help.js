const { EmbedBuilder } = require('discord.js');
const { getTranslations } = require('../../utils');
const { CommandBuilder } = require('../../utils/classes');

module.exports = new CommandBuilder()
	.setName('help')
	.setDescription('View information about the bot and its commands')
	.setCategory('Bot')
	.addStringOption(o => o.setName('command').setDescription('View information about a command'))
	.setRun(async ({ client, interaction }) => {
			const translations = getTranslations(interaction, 'commands.help');

			const commandName = interaction.options.getString('command')?.split(' ')[0];
			const command = commandName ? client.commands.find(x => x.name.toLowerCase() === commandName.toLowerCase()) || client.commands.filter(x => !x.owner && x.name_localizations).find(x => Object.values(x.name_localizations).includes(commandName)) : null;

			if (commandName) {
				if (!command || command.owner) return client.error(interaction, { description: translations.commandNotFound.change({ name: `\`${commandName}\`` }) });

				const embed = new EmbedBuilder()
					.setTitle(commandName.title())
					.setColor(client.config.embedColors.default)
					.setDescription(command.description)
					.addFields(
						{
							name: '> ' + translations.info,
							value: `
${translations.command}: ${command.mention}
${translations.category}: ${command?.category}
`
						}
					)
					.setThumbnail(client.user.displayAvatarURL());

				return await interaction.reply({
					embeds: [embed]
				});
			} else {
				const { url: website } = client.config.website;

				return await interaction.reply({
					embeds: [new EmbedBuilder()
						.setTitle(translations.embed.title)
						.setDescription(translations.embed.description.change({ name: client.user.username }))
						.addFields(
							{
								name: '> ' + translations.links, value: `
🌐 [${translations.website}](${website})
🔒 [${translations.privacyPolicy}](${website}/privacy-policy)
📄 [${translations.termsOfService}](${website}/tos)
🛠️ [${translations.supportServer}](${client.config.guilds.supportServer.invite})
🔗 [${translations.inviteLink}](${client.config.bot.invite})
`
							}
						)
						.setThumbnail(client.user.displayAvatarURL())
						.setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
						.setColor(client.config.embedColors.default)]
				});
			}
		}
	);