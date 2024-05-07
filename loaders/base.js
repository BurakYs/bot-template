const { Client: DiscordClient, GatewayIntentBits, OAuth2Scopes, Partials } = require('discord.js');
const config = require('../config');

module.exports = class extends DiscordClient {
	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds
			],
			scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
			partials: [Partials.Message, Partials.Channel, Partials.User]
		});
	}

	create() {
		global.client = this;
		this.config = config;
		this.commands = [];

		process.on('unhandledRejection', (error) => logger.error(error));
		process.on('uncaughtException', (error) => logger.error(error));

		return this;
	}

	async loader() {
		if (!process.env.TOKEN) return logger.error('Don\'t forget to set the TOKEN in the .env file.');

		try {
			['array', 'date', 'number', 'string', 'message', 'SlashCommandBuilder'].forEach(extension => require(`@/helpers/extensions/${extension}`)());

			await require('./command')(this);
			await require('./listeners')(this);
			await this.login(process.env.TOKEN);
		} catch (e) {
			logger.error(e);
		}
	}
};