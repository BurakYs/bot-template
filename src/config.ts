import { resolveColor } from 'discord.js';

export default {
    project: {
        timezone: 'Europe/Istanbul'
    },
    bot: {
        developers: ['269677849810698249'],
        supportedLanguages: {
            'en-US': 'en',
            'en-GB': 'en',
            'tr': 'tr'
        } as Record<string, string>,
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
        botLog: '',
        errorLog: ''
    },
    embedColors: {
        default: resolveColor('#5865F2'),
        error: resolveColor('#F04A47'),
        success: resolveColor('#56B849')
    }
};