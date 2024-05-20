import { SlashCommandBuilder } from 'discord.js';
import { CommandConfig } from '@/interfaces/CommandData';
import { RunFunction } from '@/types';

type PropertiesOnly<T> = Omit<T, { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T]>;
type ParsedCommandData = CommandConfig & PropertiesOnly<SlashCommandBuilder> & { run: RunFunction };

export default ParsedCommandData;