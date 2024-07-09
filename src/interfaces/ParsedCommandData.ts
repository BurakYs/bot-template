import type { SlashCommandBuilder } from 'discord.js';
import type { CommandConfig } from '@/interfaces/CommandData';
import type { RunFunction } from '@/types';

type PropertiesOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};
type ParsedCommandData = CommandConfig & PropertiesOnly<SlashCommandBuilder> & { run: RunFunction };

export default ParsedCommandData;