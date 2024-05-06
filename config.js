const { resolveColor } = require('discord.js');

module.exports = {
	project: {
		timezone: 'Europe/Istanbul'
	},
	bot: {
		admins: ['269677849810698249'],
		invite: '',
		supportedLanguages: {
			'en-US': 'en',
			'en-GB': 'en',
			'tr': 'tr'
		},
		defaultLanguage: 'en-US'
	},
	presence: {
		activity: '/help | {u} users | {s} servers',
		status: 'online'
	},
	guilds: {
		test: '',
		supportServer: {
			id: '',
			invite: ''
		}
	},
	roles: {
		errorPings: ''
	},
	channels: {
		botLog: '', // Guild join/leave logs
		errorLog: ''
	},
	embedColors: {
		default: resolveColor('#5865F2'),
		error: resolveColor('#F04A47'),
		success: resolveColor('#56B849')
	}
};