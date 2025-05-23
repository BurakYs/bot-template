import { SlashCommandBuilder } from 'discord.js';

import type { CommandData } from '@/types';

export default {
    data: new SlashCommandBuilder().setName('ping').setDescription("Check the bot's latency and response time"),
    config: {
        category: 'Bot'
    },
    run: async ({ client, interaction }) => {
        const dateBefore = Date.now();
        await interaction.reply({ content: 'Ping' });

        await interaction.editReply({
            content: `
🏓 Pong!
Discord API: ${Date.now() - dateBefore}ms
Discord Gateway: ${client.ws.ping}ms`
        });
    }
} satisfies CommandData;
