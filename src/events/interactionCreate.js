/* eslint-disable-next-line no-unused-vars */
const { ChatInputCommandInteraction, Events } = require('discord.js');
const config = require('@/config');

module.exports = {
    name: Events.InteractionCreate,
    load: true,
    /**
     * @param {import('@/loaders/base')} client
     * @param {ChatInputCommandInteraction & { language: string, success: Function, error: Function }} interaction
     */
    run: async (client, interaction) => {
        /* eslint-disable comma-dangle */
        const interactionTypes = {
            //1: 'ping',
            2: 'applicationCommand',
            //3: 'button',
            //4: 'autoComplete',
            //5: 'modal'
        };

        const interactionType = interactionTypes[interaction.type];
        if (!interactionType) return;

        const handler = require(`@/events/interactions/${interactionTypes[interaction.type]}`);
        if (!handler) return;

        const supportedLanguages = config.bot.supportedLanguages;
        interaction.language = supportedLanguages[interaction.locale] || supportedLanguages[config.bot.defaultLanguage];

        return await handler.run(client, interaction);
    }
};