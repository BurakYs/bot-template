import type { ChatInputCommandInteraction, ColorResolvable, PermissionResolvable, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';
import type ClientInstance from '@/loaders/client';

type PrimitiveOrDictionary<P extends boolean, T> = P extends true ? T : { [K in keyof T]: T[K] | Record<string, T[K]> }
type NonFunctionProperties<T> = { [K in keyof T as T[K] extends CallableFunction ? never : K]: T[K]; };

export type Client = typeof ClientInstance;

export type RunFunctionOptions = { client: Client, interaction: ChatInputCommandInteraction }
export type RunFunction = (options: RunFunctionOptions) => Promise<unknown>;

export type CommandConfig<P extends boolean = false> = PrimitiveOrDictionary<P, {
  category: string;
  tags?: string[];
  guildOnly?: boolean;
  dmOnly?: boolean;
  supportServerOnly?: boolean;
  requiredMemberPermissions?: PermissionResolvable[];
  requiredBotPermissions?: PermissionResolvable[];
  botAdminsOnly?: boolean;
  disabled?: boolean;
}>

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