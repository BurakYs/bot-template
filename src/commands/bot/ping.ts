import { SlashCommandBuilder } from 'discord.js';
import { CommandConfig } from '@/interfaces/CommandData';
import { RunFunctionOptions } from '@/types';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency and response time'),
    config: {
        category: 'Bot'
    } as CommandConfig,
    run: async ({ client, interaction }: RunFunctionOptions) => {
        const dateBefore = Date.now();
        await interaction.reply({ content: 'Ping' });

        await interaction.editReply({
            content: `
🏓 Pong!
Discord API: ${Date.now() - dateBefore}ms
Discord Gateway: ${client.ws.ping}ms`
        });
    }
};