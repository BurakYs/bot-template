import { Events, InteractionType } from 'discord.js';
import config from '@/config';
import applicationCommandHandler from '@/events/interactions/applicationCommand';
import type { EventData } from '@/types';
import defineEvent from '@/utils/defineEvent';

// biome-ignore lint/suspicious/noExplicitAny: We need to allow any type for the handler
const interactionTypes: Partial<Record<InteractionType, EventData<any>>> = {
    [InteractionType.ApplicationCommand]: applicationCommandHandler
};

export default defineEvent({
    name: Events.InteractionCreate,
    run: async (client, interaction) => {
        const handler = interactionTypes[interaction.type];
        if (!handler) return;

        const isLanguageSupported = Object.keys(config.bot.supportedLanguages).includes(interaction.locale);
        interaction.language = isLanguageSupported ? interaction.locale : config.bot.defaultLanguage;

        return handler.run(client, interaction);
    }
});
