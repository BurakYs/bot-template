import { glob } from 'glob';
import { CommandData } from '@/interfaces';
import { Snowflake } from 'discord.js';
import config from '@/config';
import Client from '@/loaders/base';

interface CommandLocalization {
    name: string;
    localizedName: string;
    localizedDescription: string;
    options?: CommandLocalization[];
}

export default class CommandLoader {
    static async loadCommands(client: Client, register: boolean) {
        const localizations: Record<string, CommandLocalization[]> = {
            'en-US': (await import('@/localizations/commandData/en.json')).default,
            'en-GB': (await import('@/localizations/commandData/en.json')).default,
            'tr': (await import('@/localizations/commandData/tr.json')).default
        };

        const folder = await glob('./dist/commands/*/*.js');
        const commands: CommandData[] = [];
        const ownerCommands: CommandData[] = [];

        await Promise.all(folder.map(async value => {
            const file = (await import(`../../${value.replace(/\\/g, '/')}`)).default;

            for (const lang in localizations) {
                const commandData = localizations[lang].find((x: CommandLocalization) => x.name === file.name);
                this.setLocalizations(lang, file, commandData);
            }

            client.commands.push(file);

            const commandList = file.ownerOnly ? ownerCommands : commands;
            commandList.push(file);
        }));

        if (register) {
            const userCommands = await client.application!.commands.set(commands);
            logger.info('Loaded global slash commands');
            this.setCommandMentions(userCommands.map((x: any) => x));

            if (config.guilds.test && ownerCommands.length) {
                await client.application!.commands.set(ownerCommands, config.guilds.test);
                logger.info('Loaded test guild slash commands');
            }

        } else {
            this.setCommandMentions((await client.application!.commands.fetch()).map((x: any) => x));
        }
    }

    static setCommandMentions(commands: (CommandData & { id: Snowflake })[]) {
        client.commandMentions = {};

        commands.forEach(x => {
            client.commandMentions[x.name] = `</${x.name}:${x.id}>`;
            x.options?.filter((x: { type: number; }) => x.type === 1).forEach((y: { name: any; }) => {
                client.commandMentions[`${x.name} ${y.name}`] = `</${x.name} ${y.name}:${x.id}>`;
            });
        });
    }

    static setLocalizations(lang: string, obj: CommandData, commandData: CommandLocalization | undefined) {
        if (!commandData) return;

        obj.name_localizations ||= {};
        obj.name_localizations[lang] = commandData.localizedName;

        obj.description_localizations ||= {};
        obj.description_localizations[lang] = commandData.localizedDescription;

        if (obj.options?.length) {
            obj.options.forEach((option: CommandData) =>
                this.setLocalizations(lang, option, commandData.options?.find((x: CommandLocalization) => x.name === option.name))
            );
        }
    }
}