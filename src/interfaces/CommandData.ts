import type { SlashCommandBuilder } from 'discord.js';

import type { RunFunction } from '@/types';

type PrimitiveOrDictionary<T> = T | Record<string, T>;

interface CommandConfig {
  category: string;
  tags?: PrimitiveOrDictionary<string[]>;
  guildOnly?: PrimitiveOrDictionary<boolean>;
  ownerOnly?: PrimitiveOrDictionary<boolean>;
  dmOnly?: PrimitiveOrDictionary<boolean>;
  memberPermission?: PrimitiveOrDictionary<string>;
  botPermission?: PrimitiveOrDictionary<string>;
  disabled?: PrimitiveOrDictionary<boolean>;
  supportServerOnly?: PrimitiveOrDictionary<boolean>;
}

export type { CommandConfig };
export default interface CommandData {
  data: SlashCommandBuilder;
  config: CommandConfig;
  run: RunFunction;
}