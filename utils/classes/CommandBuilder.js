const { SlashCommandBuilder } = require('discord.js');

class CommandBuilder extends SlashCommandBuilder {
	constructor() {
		super();
		this.tags = [];
	}

	setCategory(category) {
		this.category = category;
		return this;
	}

	setTags(tags) {
		this.tags = tags;
		return this;
	}

	setGuildOnly(guildOnly) {
		this.guildOnly = guildOnly;
		return this;
	}

	setOwnerOnly(ownerOnly) {
		this.ownerOnly = ownerOnly;
		return this;
	}

	setDMOnly(dmOnly) {
		this.dmOnly = dmOnly;
		return this;
	}

	setMemberPermission(permission) {
		this.memberPermission = permission;
		return this;
	}

	setBotPermission(permission) {
		this.botPermission = permission;
		return this;
	}

	setDisabled(disabled) {
		this.disabled = disabled;
		return this;
	}

	setSupportServerOnly(supportServerOnly) {
		this.supportServerOnly = supportServerOnly;
		return this;
	}

	match(interaction) {
		const interactionSubcommandGroup = interaction.options._group;
		const interactionSubcommand = interaction.options._subcommand;

		const findOption = (options, name) => options.find(option => option.name === name);
		const command = (interactionSubcommand
			? findOption(findOption(this.options, interactionSubcommandGroup || interaction)?.options || [], interactionSubcommand)
			: findOption(this.options, interactionSubcommand)) || this;

		return {
			tags: command.tags || this.tags || [],
			category: command.category || this.category,
			guildOnly: command.guildOnly || this.guildOnly,
			ownerOnly: command.ownerOnly || this.ownerOnly,
			dmOnly: command.dmOnly || this.dmOnly,
			memberPermission: command.memberPermission || this.memberPermission,
			botPermission: command.botPermission || this.botPermission,
			disabled: command.disabled || this.disabled,
			premiumOnly: command.premiumOnly || this.premiumOnly,
			premiumType: command.premiumType || this.premiumType,
			options: command.options || this.options,
			run: command.run || this.run,
			supportServerOnly: command.supportServerOnly || this.supportServerOnly
		};
	}

	setRun(run) {
		this.run = run;
		return this;
	}

	toJSON(showAll = false) {
		const data = {
			...super.toJSON(),
			tags: this.tags || [],
			category: this.category,
			loginRequired: this.loginRequired,
			guildOnly: this.guildOnly,
			ownerOnly: this.ownerOnly,
			dmOnly: this.dmOnly,
			memberPermission: this.memberPermission,
			botPermission: this.botPermission,
			disabled: this.disabled,
			premiumOnly: this.premiumOnly,
			premiumType: this.premiumType,
			options: this.options.map(option => option.toJSON(showAll))
		};

		if (!showAll) {
			['tags', 'category', 'loginRequired', 'guildOnly', 'ownerOnly', 'dmOnly', 'memberPermission', 'botPermission', 'disabled', 'premiumOnly', 'premiumType'].forEach(key => delete data[key]);
		}

		return data;
	}
}

module.exports = CommandBuilder;