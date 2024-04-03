const { SlashCommandSubcommandBuilder } = require('discord.js');

class SubcommandBuilder extends SlashCommandSubcommandBuilder {
	constructor(data) {
		super();
		this.options = data?.options || [];
		this.tags = data?.tags || [];
		this.category = data?.category;
		this.loginRequired = data?.loginRequired;
		this.guildOnly = data?.guildOnly;
		this.ownerOnly = data?.ownerOnly;
		this.dmOnly = data?.dmOnly;
	}

	setTags(tags) {
		this.tags = tags;
		return this;
	}

	setCategory(category) {
		this.category = category;
		return this;
	}

	setLoginRequired(loginRequired) {
		this.loginRequired = loginRequired;
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

	setPremiumOnly(premiumOnly, premiumType = 'user') {
		this.premiumOnly = premiumOnly;
		this.premiumType = premiumType;
		return this;
	}

	setSupportServerOnly(supportServerOnly) {
		this.supportServerOnly = supportServerOnly;
		return this;
	}

	setStatus(status) {
		this.status = status;
		return this;
	}

	toJSON(showAll = false) {
		const data = {
			...super.toJSON(),
			tags: this.tags,
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

module.exports = SubcommandBuilder;