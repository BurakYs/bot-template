import { Events } from 'discord.js';
import type { Interaction } from '@/interfaces';
import type Client from '@/loaders/base';
import config from '@/config';

export default {
  name: Events.InteractionCreate,
  load: true,
  run: async (client: Client, interaction: Interaction) => {
    const interactionTypes = {
      //1: 'ping',
      2: 'applicationCommand'
      //3: 'button',
      //4: 'autoComplete',
      //5: 'modal'
    };

    const interactionType = interactionTypes[interaction.type];
    if (!interactionType) return;

    const handler = (await import(`@/events/interactions/${interactionTypes[interaction.type]}`))?.default;
    if (!handler) return;

    const supportedLanguages = config.bot.supportedLanguages;
    interaction.language = supportedLanguages[interaction.locale] || supportedLanguages[config.bot.defaultLanguage];

    return await handler.run(client, interaction);
  }
};