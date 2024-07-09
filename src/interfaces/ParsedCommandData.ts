import type { SlashCommandBuilder } from 'discord.js';
import type { CommandConfig } from '@/interfaces/CommandData';
import type { RunFunction } from '@/types';

type PropertiesOnly<T> = Omit<T, { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T]>;
type ParsedCommandData = CommandConfig & PropertiesOnly<SlashCommandBuilder> & { run: RunFunction };

export default ParsedCommandData;