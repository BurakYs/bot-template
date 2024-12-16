import type { CommandInteraction } from 'discord.js';
import { Events, InteractionType } from 'discord.js';
import config from '@/config';
import type { Client, EventData } from '@/types';

export default {
  name: Events.InteractionCreate,
  run: async (client: Client, interaction: CommandInteraction) => {
    const interactionTypes = {
      [InteractionType.ApplicationCommand]: 'applicationCommand'
    };

    const interactionType = interactionTypes[interaction.type];
    if (!interactionType) return;

    const handler = (await import(`@/events/interactions/${interactionTypes[interaction.type]}`))?.default;
    if (!handler) return;

    const isCurrentLanguageSupported = Object.keys(config.bot.supportedLanguages).includes(interaction.locale);
    interaction.language = isCurrentLanguageSupported ? interaction.locale : config.bot.defaultLanguage;

    return await handler.run(client, interaction);
  }
} satisfies EventData;