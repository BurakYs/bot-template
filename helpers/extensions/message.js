const { Message, ChatInputCommandInteraction, MessageComponentInteraction } = require('discord.js');
const { messages } = require('../functions');

module.exports = function () {
	const embedMessages = {
		error: {
			value(options) {
				return messages.sendError(this, options);
			}
		},
		success: {
			value(options) {
				return messages.sendSuccess(this, options);
			}
		}
	}

	Object.defineProperties(Message.prototype, embedMessages);
	Object.defineProperties(ChatInputCommandInteraction.prototype, embedMessages);
	Object.defineProperties(MessageComponentInteraction.prototype, embedMessages);

	return true;
};