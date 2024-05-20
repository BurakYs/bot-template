/* eslint-disable semi */
import { SlashCommandBuilder } from 'discord.js';
import { RunFunction } from '@/types';

type PrimitiveOrDictionary<T> = T | { [key: string]: T };

interface BaseCommandConfig {
    category: string;
    tags: PrimitiveOrDictionary<string[]>;
    guildOnly: PrimitiveOrDictionary<boolean>;
    ownerOnly: PrimitiveOrDictionary<boolean>;
    dmOnly: PrimitiveOrDictionary<boolean>;
    memberPermission: PrimitiveOrDictionary<string>;
    botPermission: PrimitiveOrDictionary<string>;
    disabled: PrimitiveOrDictionary<boolean>;
    supportServerOnly: PrimitiveOrDictionary<boolean>;
}

type RequiredFields = 'category';
export type CommandConfig = Partial<Omit<BaseCommandConfig, RequiredFields>> & Pick<BaseCommandConfig, RequiredFields>
export default interface CommandData {
    data: SlashCommandBuilder;
    config: CommandConfig;
    run: RunFunction
}