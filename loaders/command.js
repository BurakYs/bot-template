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
    logger.info('Loading slash commands');

    folder?.map(value => {
        const file = require(`../${value}`);
        const json = file.toJSON(true);

        for (const lang in localizations) {
            const commandData = localizations[lang].find(x => x.name === json.name);
            addTranslations(lang, json, commandData, json.options);
        }

        client.commands.push(file);

        const commandList = file.ownerOnly ? ownerCommands : commands;
        commandList.push(json);
    });

    client.once(Events.ClientReady, async () => {
        try {
            const processCommands = async (commands) => {
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
                return commands;
            };

            if (client.config.bot.redeployCommands) {
                try {
                    const globalCommands = await client.application.commands.set(commands);
                    logger.success('Loaded global slash commands successfully');
                    await processCommands(globalCommands);
                } catch (err) {
                    logger.error(err);
                }

                if (client.config.guilds.test && ownerCommands.length) {
                    try {
                        await client.application.commands.set(ownerCommands, client.config.guilds.test);
                        logger.success('Loaded global slash commands successfully');
                    } catch (err) {
                        logger.error(err);
                    }
                }
            } else {
                await processCommands(await client.application.commands.fetch());
            }
        } catch (error) {
            logger.error(error);
        }
    });
};

function addTranslations(lang, obj, commandData) {
    if (!commandData) return;
    const { name, localizedName, localizedDescription, options } = commandData;

    if (obj.name === name) {
        obj.name_localizations = obj.name_localizations || {};
        if (localizedName) obj.name_localizations[lang] = localizedName;

        if (localizedDescription) {
            obj.description_localizations = obj.description_localizations || {};
            obj.description_localizations[lang] = localizedDescription;
        }
    }

    if (options && options.length > 0) {
        options.forEach(option => {
            const optionLocalization = obj.options?.find(x => x.name === option.name);
            if (optionLocalization) {
                optionLocalization.name_localizations = optionLocalization.name_localizations || {};
                if (option.localizedName) optionLocalization.name_localizations[lang] = option.localizedName;

                if (option.localizedDescription) {
                    optionLocalization.description_localizations = optionLocalization.description_localizations || {};
                    optionLocalization.description_localizations[lang] = option.localizedDescription;
                }

                if (option.options && option.options.length > 0) addTranslations(lang, optionLocalization, option);
            }
        });
    }
}