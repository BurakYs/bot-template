import type { Interaction } from 'discord.js';
import { Events, InteractionType } from 'discord.js';
import config from '@/config';
import applicationCommandHandler from '@/events/interactions/applicationCommand';
import type { Client, EventData } from '@/types';

const interactionTypes: Partial<Record<InteractionType, EventData>> = {
    [InteractionType.ApplicationCommand]: applicationCommandHandler
};

export default {
    name: Events.InteractionCreate,
    run: async (client: Client, interaction: Interaction) => {
        const handler = interactionTypes[interaction.type];
        if (!handler) return;

        const isLanguageSupported = Object.keys(config.bot.supportedLanguages).includes(interaction.locale);
        interaction.language = isLanguageSupported ? interaction.locale : config.bot.defaultLanguage;

        return handler.run(client, interaction);
    }
} satisfies EventData;
