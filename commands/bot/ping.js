const { SlashCommandBuilder } = require('discord.js');

module.exports = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s latency and response time')
    .setCategory('Bot')
    .setRun(async ({ client, interaction }) => {
        const dateBefore = Date.now();
        await interaction.reply({ content: 'Ping' });

        return await interaction.editReply({
            content: `
🏓 Pong!
Discord API: ${Date.now() - dateBefore}ms
Discord Gateway: ${client.ws.ping}ms`
        });
    });