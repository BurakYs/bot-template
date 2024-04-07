const { InteractionType, EmbedBuilder, resolveColor, ChatInputCommandInteraction } = require('discord.js');
const { getTranslations } = require('../../helpers/functions');

module.exports = {
	name: 'applicationCommand',
	/**
	 * @param {import('../../loaders/base')} client
	 * @param {ChatInputCommandInteraction & { language: string }} interaction
	 */
	async run(client, interaction) {
		if (interaction.type === InteractionType.ApplicationCommand) {
			const cmd = client.commands.find(x => x.name === interaction.commandName);
			if (!cmd) return;

			interaction.language = client.config.bot.supportedLanguages[interaction.locale] || client.config.bot.supportedLanguages[client.config.bot.defaultLanguage];

			const translations = getTranslations(interaction, 'standard');
			const permissions = getTranslations(interaction, 'permissions');

			const commandData = cmd.match(interaction);

			if (commandData.ownerOnly === true && !client.config.bot.admins.includes(interaction.user.id)) return;
			if (commandData.dmOnly === true && interaction.guild) return client.error(interaction, { description: translations.commandDMOnly });
			if (commandData.guildOnly === true && !interaction.guild) return client.error(interaction, { description: translations.commandGuildOnly });
			if (commandData.disabled && !client.config.bot.admins.includes(interaction.user.id)) return client.error(interaction, { description: translations.commandDisabled });
			if (commandData.supportServerOnly && ![client.config.guilds.supportServer.id, client.config.guilds.test.id].includes(interaction.guild?.id)) return client.error(interaction, { description: translations.commandSupportServerOnly.change({ support: client.config.guilds.supportServer.invite }) });
			if (commandData.memberPermission && !interaction.member.permissions.has(commandData.memberPermission)) {
				const permission = permissions[commandData.memberPermission] || commandData.memberPermission;
				
				return client.error(interaction, { description: translations.commandUserMissingPerms.change({ permissions: `\`${permission}\`` }) });
			}
			if (commandData.botPermission && !interaction.guild.members.me.permissions.has(commandData.botPermission)) {
				const permission = permissions[commandData.botPermission] || commandData.botPermission;
				
				return client.error(interaction, { description: translations.commandBotMissingPerms.change({ permissions: `\`${permission}\`` }) });
			}

			try {
				const commandTranslations = getTranslations(interaction, `commands.${interaction.commandName}`);
				await cmd.run({ client, interaction, translations: commandTranslations });
			} catch (error) {
				if (error) {
					if (interaction.commandName !== 'eval') {
						if (error instanceof Error && ['unknown interaction', 'interaction has already been acknowledged'].includes(error.message?.toLowerCase())) return;

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