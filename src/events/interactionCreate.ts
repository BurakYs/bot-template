import { Events, Interaction, InteractionType } from 'discord.js';
import config from '@/config';
import applicationCommandHandler from '@/events/interactions/applicationCommand';
import type { Client, EventData } from '@/types';

export default {
  name: Events.InteractionCreate,
  run: async (client: Client, interaction: Interaction) => {
    const interactionTypes: Partial<Record<InteractionType, EventData>> = {
      [InteractionType.ApplicationCommand]: applicationCommandHandler
    };

    const handler = interactionTypes[interaction.type];
    if (!handler) return;

    const isCurrentLanguageSupported = Object.keys(config.bot.supportedLanguages).includes(interaction.locale);
    interaction.language = isCurrentLanguageSupported ? interaction.locale : config.bot.defaultLanguage;

    return await handler.run(client, interaction);
  }
} satisfies EventData;