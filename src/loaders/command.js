const { glob } = require('glob');
const config = require('@/config');
const localizations = {
    'en-US': require('@/localizations/commandData/en.json'),
    'en-GB': require('@/localizations/commandData/en.json'),
    'tr': require('@/localizations/commandData/tr.json')
};

class CommandLoader {
    static loadCommands(client, register) {
        const folder = glob.sync('./src/commands/*/*.js');
        const commands = [];
        const ownerCommands = [];

        folder.map(value => {
            const file = require(`../../${value.replace(/\\/g, '/')}`);
            const json = file.toJSON(true);

            for (const lang in localizations) {
                const commandData = localizations[lang].find(x => x.name === json.name);
                CommandLoader.setLocalizations(lang, json, commandData);
            }

            client.commands.push(file);

            const commandList = file.ownerOnly ? ownerCommands : commands;
            commandList.push(json);
        });

        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            if (register) {
                try {
                    const userCommands = await client.application.commands.set(commands);
                    logger.info('Loaded global slash commands');
                    CommandLoader.setCommandMentions(userCommands);

                    if (config.guilds.test && ownerCommands.length) {
                        await client.application.commands.set(ownerCommands, config.guilds.test);
                        logger.info('Loaded test guild slash commands');
                    }

                    resolve();
                } catch (e) {
                    reject(e);
                }
            } else {
                CommandLoader.setCommandMentions(await client.application.commands.fetch());
                resolve();
            }
        });
    }

    static setCommandMentions(commands) {
        client.commandMentions = {};

        commands.map(x => x).forEach(x => {
            client.commandMentions[x.name] = `</${x.name}:${x.id}>`;
            x.options?.filter(x => x.type === 1).forEach(y => {
                client.commandMentions[`${x.name} ${y.name}`] = `</${x.name} ${y.name}:${x.id}>`;
            });
        });
    }

    static setLocalizations(lang, obj, commandData) {
        if (!commandData) return;

        obj.name_localizations ||= {};
        obj.name_localizations[lang] = commandData.localizedName;

        obj.description_localizations ||= {};
        obj.description_localizations[lang] = commandData.localizedDescription;

        if (obj.options?.length) {
            obj.options.forEach(option =>
                CommandLoader.setLocalizations(lang, option, commandData.options.find(x => x.name === option.name))
            );
        }
    }
}

module.exports = CommandLoader;