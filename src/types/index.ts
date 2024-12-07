import type { ChatInputCommandInteraction, ColorResolvable, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import type ClientInstance from '@/loaders/client';

type PrimitiveOrDictionary<T> = T | Record<string, T>;
type PropertiesOnly<T> = { [K in keyof T as T[K] extends CallableFunction ? never : K]: T[K]; };

export type Client = typeof ClientInstance;

export type RunFunctionOptions = { client: Client, interaction: ChatInputCommandInteraction, translations: any }
export type RunFunction = (options: RunFunctionOptions) => Promise<unknown>;

export type CommandConfig = {
  category: PrimitiveOrDictionary<string>;
  tags?: PrimitiveOrDictionary<string[]>;
  guildOnly?: PrimitiveOrDictionary<boolean>;
  dmOnly?: PrimitiveOrDictionary<boolean>;
  supportServerOnly?: PrimitiveOrDictionary<boolean>;
  memberPermission?: PrimitiveOrDictionary<string>;
  botPermission?: PrimitiveOrDictionary<string>;
  botAdminOnly?: PrimitiveOrDictionary<boolean>;
  disabled?: PrimitiveOrDictionary<boolean>;
}

export type CommandData = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  config: CommandConfig;
  run: RunFunction;
}

export type ResolvedCommandData = CommandConfig & PropertiesOnly<SlashCommandBuilder> & { run: RunFunction };

export type SendMessageOptions = {
  content: string;
  title: string;
  author: { name: string; iconURL?: string };
  description: string;
  fields: { name: string; value: string; inline?: boolean }[];
  color: ColorResolvable | string;
  thumbnail: string;
  image: string;
  footer: { text: string; iconURL?: string };
  ephemeral: boolean;
  action: 'reply' | 'editReply' | 'followUp';
}

export type EventData = {
  name: string;
  once?: boolean;
  dontLoad?: boolean;
  run: CallableFunction;
}