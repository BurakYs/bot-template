const { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder, ChatInputCommandInteraction } = require('discord.js');

class CommandBuilder extends SlashCommandBuilder {
	constructor() {
		super();
	}

	/**
	 * Set the category of the command
	 * @param {string} category The category of the command
	 * @returns {CommandBuilder}
	 */
	setCategory(category) {
		this.category = category;
		return this;
	}

	/**
	 * Set the tags of the command
	 * @param {string[]} tags The tags of the command
	 * @returns {CommandBuilder}
	 */
	setTags(tags) {
		this.tags = tags;
		return this;
	}

	/**
	 * Set if the command can only be used in a guild
	 * @param {boolean} guildOnly If the command can only be used in a guild
	 * @returns {CommandBuilder}
	 */
	setGuildOnly(guildOnly) {
		this.guildOnly = guildOnly;
		return this;
	}

	/**
	 * Set if the command can only be used by the bot owners
	 * @param {boolean} ownerOnly If the command can only be used by the bot owner
	 * @returns {CommandBuilder}
	 */
	setOwnerOnly(ownerOnly) {
		this.ownerOnly = ownerOnly;
		return this;
	}

	/**
	 * Set if the command can only be used in DMs
	 * @param {boolean} dmOnly If the command can only be used in a DM
	 * @returns {CommandBuilder}
	 */
	setDMOnly(dmOnly) {
		this.dmOnly = dmOnly;
		return this;
	}

	/**
	 * Set the member permission required to run the command
	 * @param {string} permission The permission required to run the command
	 * @returns {CommandBuilder}
	 */
	setMemberPermission(permission) {
		this.memberPermission = permission;
		return this;
	}

	/**
	 * Set the bot permission required to run the command
	 * @param {string} permission The permission required to run the command
	 * @returns {CommandBuilder}
	 */
	setBotPermission(permission) {
		this.botPermission = permission;
		return this;
	}

	/**
	 * Set if the command is disabled
	 * @param {boolean} disabled If the command is disabled
	 * @returns {CommandBuilder}
	 */
	setDisabled(disabled) {
		this.disabled = disabled;
		return this;
	}

	/**
	 * Set if the command can only be used in the support server
	 * @param {boolean} supportServerOnly If the command can only be used in the support server
	 * @returns {CommandBuilder}
	 */
	setSupportServerOnly(supportServerOnly) {
		this.supportServerOnly = supportServerOnly;
		return this;
	}

	/**
	 * Adds a new subcommand group to this command.
	 * @param {(SlashCommandSubcommandGroupBuilder) | ((subcommandGroup: SlashCommandSubcommandGroupBuilder) => SlashCommandSubcommandGroupBuilder)} input The subcommand group to add, or a function that returns a subcommand group
	 * @returns {CommandBuilder}
	 */
	addSubcommandGroup(input) {
		const subcommandGroup = input instanceof SlashCommandSubcommandGroupBuilder ? input : input(new SlashCommandSubcommandGroupBuilder());
		super.addSubcommandGroup(subcommandGroup);
		return this;
	}

	/**
	 * Adds a new subcommand to this command.
	 * @param {SlashCommandSubcommandBuilder | ((subcommand: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)} input The subcommand to add, or a function that returns a subcommand
	 * @returns {CommandBuilder}
	 */
	addSubcommand(input) {
		const subcommand = input instanceof SlashCommandSubcommandBuilder ? input : input(new SlashCommandSubcommandBuilder());
		super.addSubcommand(subcommand);
		return this;
	}

	/**
	 * Set the run function of the command
	 * @param {function({ client: Client, interaction: ChatInputCommandInteraction, translations?: Object }): Promise<any>} run The run function of the command
	 * @returns {CommandBuilder}
	 */
	setRun(run) {
		this.run = run;
		return this;
	}

	/**
	 * Match the command data with the interaction
	 * @param {ChatInputCommandInteraction} interaction The interaction to match the command data with
	 * @returns {{memberPermission: string, botPermission: string, ownerOnly: boolean, supportServerOnly: boolean, options: any[], disabled: boolean, run, category: string, guildOnly: boolean, tags: ([]|*[]), dmOnly: boolean}}
	 */
	match(interaction) {
		const interactionSubcommandGroup = interaction.options._group;
		const interactionSubcommand = interaction.options._subcommand;

		const findOption = (options, name) => options.find(option => option.name === name);
		const command = (interactionSubcommandGroup
			? findOption(findOption(this.options, interactionSubcommandGroup || interactionSubcommand)?.options || [], interactionSubcommand)
			: findOption(this.options, interactionSubcommand)) || this;

		return {
			tags: command.tags || this.tags || [],
			category: command.category || this.category,
			supportServerOnly: command.supportServerOnly ?? this.supportServerOnly,
			guildOnly: command.guildOnly ?? this.guildOnly,
			ownerOnly: command.ownerOnly ?? this.ownerOnly,
			dmOnly: command.dmOnly ?? this.dmOnly,
			memberPermission: command.memberPermission || this.memberPermission,
			botPermission: command.botPermission || this.botPermission,
			disabled: command.disabled ?? this.disabled,
			options: command.options || this.options,
			run: this.run
		};
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
};

module.exports = CommandBuilder;