const { EmbedBuilder } = require('discord.js');
const { CommandBuilder } = require('../../helpers/classes');

module.exports = new CommandBuilder()
	.setName('help')
	.setDescription('View information about the bot and its commands')
	.setCategory('Bot')
	.addSubcommand(s => s
		.setName('command')
		.setDescription('View information about a specific command')
		.setCategory('User')

		.addStringOption(o => o
			.setName('command')
			.setDescription('The command to get information about')
			.setRequired(true)
		)
	)
	.setRun(async ({ client, interaction, translations }) => {
			const commandName = interaction.options.getString('command')?.split(' ')[0];
			const command = commandName ? client.commands.find(x => x.name.toLowerCase() === commandName.toLowerCase()) || client.commands.filter(x => !x.owner && x.name_localizations).find(x => Object.values(x.name_localizations).includes(commandName)) : null;
			const { url: website } = client.config.website;
			let embed;

			if (commandName) {
				if (!command || command.owner) return client.error(interaction, { description: translations.commandNotFound.change({ name: `\`${commandName}\`` }) });

				embed = new EmbedBuilder()
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
			} else {
				embed = new EmbedBuilder()
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
						.setColor(client.config.embedColors.default)
			}

			await interaction.reply({
				embeds: [embed]
			});
		}
	);