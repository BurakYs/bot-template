const { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder } = require('discord.js');

module.exports = function () {
	// TODO: Code suggestions don't work for these functions

	const commandBuilderFunctions = {
		setCategory: {
			value: function (category) {
				this.category = category;
				return this;
			}
		},
		setTags: {
			value: function (tags) {
				this.tags = tags;
				return this;
			}
		},
		setLoginRequired: {
			value: function (loginRequired) {
				this.loginRequired = loginRequired;
				return this;
			}
		},
		setGuildOnly: {
			value: function (guildOnly) {
				this.guildOnly = guildOnly;
				return this;
			}
		},
		setOwnerOnly: {
			value: function (ownerOnly) {
				this.ownerOnly = ownerOnly;
				return this;
			}
		},
		setDMOnly: {
			value: function (dmOnly) {
				this.dmOnly = dmOnly;
				return this;
			}
		},
		setMemberPermission: {
			value: function (permission) {
				this.memberPermission = permission;
				return this;
			}
		},
		setBotPermission: {
			value: function (permission) {
				this.botPermission = permission;
				return this;
			}
		},
		setDisabled: {
			value: function (disabled) {
				this.disabled = disabled;
				return this;
			}
		},
		setPremiumOnly: {
			value: function (premiumOnly, premiumType = 'user') {
				this.premiumOnly = premiumOnly;
				this.premiumType = premiumType;
				return this;
			}
		},
		setSupportServerOnly: {
			value: function (supportServerOnly) {
				this.supportServerOnly = supportServerOnly;
				return this;
			}
		},
		setStatus: {
			value: function (status) {
				this.status = status;
				return this;
			}
		},
		setRun: {
			value: function (run) {
				this.run = run;
				return this;
			}
		},
		match: {
			value: function (interaction) {
				const interactionSubcommandGroup = interaction.options._group;
				const interactionSubcommand = interaction.options._subcommand;

				const findOption = (options, name) => options.find(option => option.name === name);
				const command = (interactionSubcommandGroup
					? findOption(findOption(this.options, interactionSubcommandGroup || interactionSubcommand)?.options || [], interactionSubcommand)
					: findOption(this.options, interactionSubcommand)) || this;

				return {
					tags: command.tags || [],
					category: command.category || this.category,
					loginRequired: command.loginRequired ?? this.loginRequired,
					guildOnly: command.guildOnly ?? this.guildOnly,
					ownerOnly: command.ownerOnly ?? this.ownerOnly,
					dmOnly: command.dmOnly ?? this.dmOnly,
					memberPermission: command.memberPermission || this.memberPermission,
					botPermission: command.botPermission || this.botPermission,
					disabled: command.disabled ?? this.disabled,
					premiumOnly: command.premiumOnly ?? this.premiumOnly,
					premiumType: command.premiumType || this.premiumType,
					options: command.options || this.options,
					run: this.run,
					supportServerOnly: command.supportServerOnly ?? this.supportServerOnly
				};
			}
		},
		toJSON: {
			value: function (showAll = false) {
				const data = Object.assign(this, {
					tags: this.tags || []
				});

				if (!showAll) {
					['tags', 'category', 'loginRequired', 'guildOnly', 'ownerOnly', 'dmOnly', 'memberPermission', 'botPermission', 'disabled', 'premiumOnly', 'premiumType'].forEach(key => delete data[key]);
				}

				return data;
			}
		}
	};

	Object.defineProperties(SlashCommandBuilder.prototype, commandBuilderFunctions);
	Object.defineProperties(SlashCommandSubcommandGroupBuilder.prototype, commandBuilderFunctions);
	Object.defineProperties(SlashCommandSubcommandBuilder.prototype, commandBuilderFunctions);

	return true;
};