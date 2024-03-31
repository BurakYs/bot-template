const { InteractionType, EmbedBuilder, resolveColor } = require('discord.js');
const { getTranslations } = require('../../helpers/functions');

module.exports = {
	name: 'applicationCommand',
	async run(client, interaction) {
		if (interaction.type === InteractionType.ApplicationCommand) {
			const cmd = client.commands.find(x => x.name === interaction.commandName);
			if (!cmd) return;

			interaction.language = client.config.bot.supportedLanguages[interaction.locale] || client.config.bot.supportedLanguages[client.config.bot.defaultLanguage];

			const translations = getTranslations(interaction, 'standard');

			const match = cmd.match(interaction);
			const { disabled, guildOnly, dmOnly, memberPermission, botPermission, ownerOnly, supportServerOnly } = match;

			if (ownerOnly === true && !client.config.bot.admins.includes(interaction.user.id)) return;
			if (dmOnly === true && interaction.guild) return client.error(interaction, { description: translations.commandDMOnly });
			if (guildOnly === true && !interaction.guild) return client.error(interaction, { description: translations.commandGuildOnly });
			if (disabled && !client.config.bot.admins.includes(interaction.user.id)) return client.error(interaction, { description: translations.commandDisabled });
			if (supportServerOnly && ![client.config.guilds.supportServer.id, client.config.guilds.test.id].includes(interaction.guild?.id)) return client.error(interaction, { description: translations.commandSupportServerOnly.change({ support: client.config.guilds.supportServer.invite }) });
			if (memberPermission && !interaction.member.permissions.has(memberPermission)) return client.error(interaction, { description: translations.commandUserMissingPerms.change({ permissions: `\`${memberPermission}\`` }) });
			if (botPermission) {
				if (!interaction.guild.members.me.permissions.has(botPermission)) {
					return client.error(interaction, { description: translations.commandBotMissingPerms.change({ permissions: `\`${botPermission}\`` }) });
				}
			}

			try {
				await cmd.run({ client, interaction });
			} catch (error) {
				if (error) {
					if (interaction.commandName !== 'eval') {
						if (error instanceof Error && ['unknown interaction', 'interaction has already been acknowledged'].includes(error.message)) return;

						await client.channels.cache.get(client.config.channels.errorLog)?.send({
							content: `<@&${client.config.roles.errorPings}>`,
							embeds: [
								new EmbedBuilder()
									.setTitle('Error')
									.setColor(resolveColor('Red'))
									.setDescription(`
\`Server:\` ${interaction.guild?.name || 'DM'} | ${interaction.guild?.id || 'DM'}
\`Channel:\` ${interaction.channel?.name || 'DM'} ${interaction.channel?.id || 'DM'}
\`User:\` ${interaction.user.tag} | ${interaction.user.id}
\`Command:\` ${interaction.commandName}
        
\`Error:\` \`\`\`js\n${error.toString().slice(0, 3000)}\`\`\` 
`)
							]
						});
					}

					logger.error(error);
					return client.error(interaction, {
						description: translations.unexpectedErrorOccurred.change({ support: client.config.guilds.supportServer.invite }),
						ephemeral: true
					});
				}
			}
		}
	}
};