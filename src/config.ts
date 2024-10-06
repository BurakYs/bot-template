import { ActivityType, type PresenceData, resolveColor } from 'discord.js';

export default {
  bot: {
    admins: ['269677849810698249'],
    supportedLanguages: {
      'en-US': 'en',
      'en-GB': 'en',
      'tr': 'tr'
    } as Record<string, string>,
    defaultLanguage: 'en-US'
  },
  presence: {
    activities: [{
      type: ActivityType.Custom,
      name: 'status',
      state: '/help | {u} users | {s} servers'
    }],
    status: 'online'
  } satisfies PresenceData,
  guilds: {
    test: '',
    supportServer: {
      id: '',
      invite: ''
    }
  },
  embedColors: {
    default: resolveColor('#5865F2'),
    error: resolveColor('#F04A47'),
    success: resolveColor('#56B849')
  }
};