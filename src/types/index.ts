import type { ChatInputCommandInteraction, ColorResolvable, PermissionResolvable, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import type ClientInstance from '@/loaders/client';

type PrimitiveOrDictionary<P, T> = P extends true ? T : T | Record<string, T>;
type NonFunctionProperties<T> = { [K in keyof T as T[K] extends CallableFunction ? never : K]: T[K]; };

export type Client = typeof ClientInstance;

export type RunFunctionOptions = { client: Client, interaction: ChatInputCommandInteraction, translations: any }
export type RunFunction = (options: RunFunctionOptions) => Promise<unknown>;

export type CommandConfig<P = false> = {
  category: PrimitiveOrDictionary<P, string>;
  tags?: PrimitiveOrDictionary<P, string[]>;
  guildOnly?: PrimitiveOrDictionary<P, boolean>;
  dmOnly?: PrimitiveOrDictionary<P, boolean>;
  supportServerOnly?: PrimitiveOrDictionary<P, boolean>;
  requiredMemberPermissions?: PrimitiveOrDictionary<P, PermissionResolvable[]>;
  requiredBotPermissions?: PrimitiveOrDictionary<P, PermissionResolvable[]>;
  botAdminOnly?: PrimitiveOrDictionary<P, boolean>;
  disabled?: PrimitiveOrDictionary<P, boolean>;
}

export type CommandData = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  config: CommandConfig;
  run: RunFunction;
}

export type ResolvedCommandData = CommandConfig<true> & NonFunctionProperties<SlashCommandBuilder> & { run: RunFunction };

export type CustomMessageOptions = {
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