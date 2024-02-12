const { resolveColor } = require('discord.js');

module.exports = {
    project: {
        environment: 'dev', // dev, prod, staging
        timezone: 'Europe/Istanbul'
    },
    bot: {
        admins: ['269677849810698249'],
        token: '',
        redeployCommands: false,
        invite: '',
        supportedLanguages: {
            'en-US': 'en',
            'en-GB': 'en',
            'tr': 'tr'
        },
        defaultLanguage: 'en-US'
    },
    website: {
        url: 'https://google.com'
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
        botLog: '',
        errorLog: ''
    },
    embedColors: {
        default: resolveColor('#5865F2'),
        error: resolveColor('#f04a47'),
        success: resolveColor('#56B849')
    }
};