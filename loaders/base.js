const { OAuth2Scopes, Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const { getTranslations } = require('../utils');

module.exports = class extends Client {
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
		global.setLongTimeout = function (callback, delay) {
			if (delay <= 0) {
				callback();
			} else if (delay <= 2147483647) {
				setTimeout(callback, delay);
			} else {
				setTimeout(() => {
					setLongTimeout(callback, delay - 2147483647);
				}, 2147483647);
			}
		};

		this.config = require('../config.js');

		this.error = function error(interaction, options = {}) {
			const operation = (interaction.deferred || interaction.replied) ? 'editReply' : options.type || 'reply';
			options.title = createTitle(options.title, getTranslations(interaction, 'common.embeds.errorTitles').random(), ':x:');
			options.thumbnail = options.thumbnail?.url || options.thumbnail;
			options.image = options.image?.url || options.image;

			if (options.noEmbed && !Object.keys(options.fields).length) {
				return interaction[operation]({
					content: `${options.title ? `## ${options.title}\n` : ''}${options.description}${options.footer ? `\n\n${options.footer.text || options.footer}` : ''}`,
					allowedMentions: { parse: [] },
					ephemeral: options.ephemeral || false
				});
			}

			const embed = new EmbedBuilder()
				.setAuthor(options.author || null)
				.setThumbnail(options.thumbnail?.url || null)
				.setImage(options.image?.url || null)
				.setTitle(options.title || null)
				.setColor(options.color || this.config.embedColors.error)
				.setDescription(options.description || null)
				.setFooter(options.footer || null)
				.addFields(options.fields || []);

			return interaction[operation]({
				content: options.content,
				embeds: [embed],
				ephemeral: options.ephemeral || false,
				components: []
			}).catch(() => null);
		};

		this.success = function success(interaction, options = {}) {
			const operation = (interaction.deferred || interaction.replied) ? 'editReply' : (options.type || 'reply');
			options.title = createTitle(options.title, getTranslations(interaction, 'common.embeds.successTitles').random(), ':white_check_mark:');
			options.thumbnail = options.thumbnail?.url || options.thumbnail;
			options.image = options.image?.url || options.image;

			if (options.noEmbed && !Object.keys(options.fields).length) {
				return interaction[operation]({
					content: `${options.title ? `## ${options.title}\n` : ''}${options.description}${options.footer ? `\n\n${typeof options.footer === 'object' ? options.footer.text : options.footer || null}` : ''}`,
					allowedMentions: { parse: [] },
					ephemeral: options.ephemeral || false
				});
			}

			return interaction[operation]({
				content: options.content || null,
				embeds: [new EmbedBuilder()
					.setAuthor(options.author || null)
					.setThumbnail(options.thumbnail || null)
					.setImage(options.image || null)
					.setTitle(options.title || null)
					.setColor(options.color || this.config.embedColors.success)
					.setDescription(options.description || null)
					.addFields(options.fields || [])
				],
				ephemeral: options.ephemeral || false,
				components: []
			}).catch(() => null);
		};

		this.commands = [];

		process.on('unhandledRejection', (err) => {
			if (err?.message?.toLowerCase()?.includes('discordapierror')) return;
			logger.error(err);
		});
		process.on('uncaughtException', (err) => {
			if (err?.message?.toLowerCase()?.includes('discordapierror')) return;
			logger.error(err);
		});

		return this;
	}

	async loader() {
		if (!process.env.TOKEN) return logger.error('Don\'t forget to set the TOKEN in the .env file.');

		try {
			require('../extensions/array.js')();
			require('../extensions/date.js')();
			require('../extensions/number.js')();
			require('../extensions/string.js')();
			require('../extensions/object.js')();

			await require('./command.js')(this);
			await require('./listeners.js')(this);
			await this.login(process.env.TOKEN);
		} catch (e) {
			logger.error(e);
		}
	}
};

function createTitle(title, defaultTitle, emoji) {
	if (title?.includes(':')) return title;

	if (Math.random() < 0.9) {
		title ||= defaultTitle;
		title = Math.random() < 0.5 ? title + ` ${emoji}` : `${emoji} ` + title;
	} else if (Math.random() < 0.25) {
		title = null;
	}

	return title;
}