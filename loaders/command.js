const { glob } = require('glob');
const { Events } = require('discord.js');
const localizations = {
	'en-US': require('../localizations/commandData/en.json'),
	'en-GB': require('../localizations/commandData/en.json'),
	'tr': require('../localizations/commandData/tr.json')
};

module.exports = async (client) => {
	const folder = await glob('./commands/*/*.js');
	const commands = [];
	const ownerCommands = [];

	folder.map(value => {
		const file = require(`../${value}`);
		const json = file.toJSON(true);

		for (const lang in localizations) {
			const commandData = localizations[lang].find(x => x.name === json.name);
			setLocalizations(lang, json, commandData);
		}

		client.commands.push(file);

		const commandList = file.ownerOnly ? ownerCommands : commands;
		commandList.push(json);
	});

	client.once(Events.ClientReady, async () => {
		if (client.config.bot.redeployCommands) {
			await client.application.commands.set(commands).then(async () => {
				logger.info('Loaded global slash commands successfully');
				setCommandMentions(commands);
			}).catch(err => logger.error(err));

			if (client.config.guilds.test && ownerCommands.length) {
				await client.application.commands.set(ownerCommands, client.config.guilds.test).then(() => {
					logger.info('Loaded global slash commands successfully');
				}).catch(err => logger.error(err));
			}
		} else {
			setCommandMentions(await client.application.commands.fetch());
		}

		function setCommandMentions(commands) {
			commands.map(x => x).forEach(x => {
				const command = client.commands.find(y => y.name === x.name);
				if (command) {
					command.mention = `</${x.name}:${x.id}>`;
					x.options?.filter(x => x.type === 1).forEach(y => {
						const option = command.options.find(z => z.name === y.name);
						if (option) option.mention = `</${x.name} ${y.name}:${x.id}>`;
					});
				}
			});
		}
	});
};

function setLocalizations(lang, obj, commandData) {
	if (!commandData) return;

	obj.name_localizations ||= {};
	obj.name_localizations[lang] = commandData.localizedName;

	obj.description_localizations ||= {};
	obj.description_localizations[lang] = commandData.localizedDescription;

	if (obj.options?.length) {
		obj.options.forEach(option =>
			setLocalizations(lang, option, commandData.options.find(x => x.name === option.name))
		);
	}
}