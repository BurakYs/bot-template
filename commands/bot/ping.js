const { CommandBuilder } = require('../../utils/classes');

module.exports = new CommandBuilder()
	.setName('ping')
	.setDescription('Check the bot\'s latency and response time')
	.setCategory('Bot')
	.setRun(async ({ client, interaction }) => {
		const dateBefore = Date.now();
		const message = await interaction.reply({ content: 'Ping' });

		return await message.edit({
			content: `
🏓 Pong!
Discord API: ${Date.now() - dateBefore}ms
Discord Gateway: ${client.ws.ping}ms`
		});
	});