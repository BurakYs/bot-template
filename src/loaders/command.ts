import { glob } from 'glob';
import { CommandData } from '@/interfaces';
import { ApplicationCommand, Collection, SlashCommandBuilder, Snowflake } from 'discord.js';
import { Locale } from 'discord-api-types/v10';
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
        const localizations: Partial<Record<Locale, CommandLocalization[]>> = {
            'en-US': (await import('@/localizations/commandData/en.json')).default,
            'en-GB': (await import('@/localizations/commandData/en.json')).default,
            'tr': (await import('@/localizations/commandData/tr.json')).default
        };

        const folder = await glob('./dist/commands/*/*.js');
        const commands: CommandData['data'][] = [];
        const ownerCommands: CommandData['data'][] = [];

        await Promise.all(folder.map(async value => {
            const file = (await import(`../../${value.replace(/\\/g, '/')}`)).default;

            for (const lang in localizations) {
                const commandData = localizations[lang as Locale]?.find((x: CommandLocalization) => x.name === file.data.name);
                this.setLocalizations(lang as Locale, file.data, commandData);
            }

            const commandList = file.ownerOnly ? ownerCommands : commands;
            commandList.push(file);

            client.commands.push(file);
        }));

        if (register) {
            const userCommands = await client.application!.commands.set(commands);
            logger.info('Loaded global slash commands');
            this.setCommandMentions(client, userCommands);

            if (config.guilds.test && ownerCommands.length) {
                await client.application!.commands.set(ownerCommands, config.guilds.test);
                logger.info('Loaded test guild slash commands');
            }
        } else {
            this.setCommandMentions(client, await client.application!.commands.fetch());
        }
    }

    static setCommandMentions(client: Client, commands: Collection<Snowflake, ApplicationCommand>) {
        client.commandMentions = {};

        commands.forEach(x => {
            client.commandMentions[x.name] = `</${x.name}:${x.id}>`;
            x.options?.filter((x: { type: number; }) => x.type === 1).forEach((y: { name: string; }) => {
                client.commandMentions[`${x.name} ${y.name}`] = `</${x.name} ${y.name}:${x.id}>`;
            });
        });
    }

    static setLocalizations(lang: Locale, obj: SlashCommandBuilder, commandData: CommandLocalization | undefined) {
        if (!commandData) return;

        obj.setNameLocalization(lang, commandData.localizedName);
        obj.setDescriptionLocalization(lang, commandData.localizedDescription);

        if (obj.options?.length) obj.options.forEach((option: any) =>
            this.setLocalizations(lang, option, commandData.options?.find((x: CommandLocalization) => x.name === option.name))
        );
    }
}