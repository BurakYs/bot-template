import { ActivityType, Locale, type PresenceData, resolveColor } from 'discord.js';

export default {
  bot: {
    admins: ['269677849810698249'],
    supportedLanguages: {
      [Locale.EnglishUS]: 'en',
      [Locale.EnglishGB]: 'en',
      [Locale.Turkish]: 'tr'
    },
    defaultLanguage: Locale.EnglishUS
  },
  presence: {
    activities: [{
      type: ActivityType.Custom,
      name: 'status',
      state: 'Hi'
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