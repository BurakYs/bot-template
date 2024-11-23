import type {
  ChatInputCommandInteraction,
  ColorResolvable,
  Message,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import type ClientInstance from '@/loaders/client';

export type Client = typeof ClientInstance;
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- We don't know what the translations will be
export type RunFunctionOptions = { client: Client, interaction: Interaction, translations: any }
export type RunFunction = (options: RunFunctionOptions) => Promise<unknown>;

export type PrimitiveOrDictionary<T> = T | Record<string, T>;

export type CommandConfig = {
  category: string;
  tags?: PrimitiveOrDictionary<string[]>;
  guildOnly?: PrimitiveOrDictionary<boolean>;
  botAdminOnly?: PrimitiveOrDictionary<boolean>;
  dmOnly?: PrimitiveOrDictionary<boolean>;
  memberPermission?: PrimitiveOrDictionary<string>;
  botPermission?: PrimitiveOrDictionary<string>;
  disabled?: PrimitiveOrDictionary<boolean>;
  supportServerOnly?: PrimitiveOrDictionary<boolean>;
}

export type CommandData = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  config: CommandConfig;
  run: RunFunction;
}

export type Interaction<T = ChatInputCommandInteraction> = T & {
  language?: string;
  success: (options: Partial<SendMessageOptions>) => Promise<Message>;
  error: (options: Partial<SendMessageOptions>) => Promise<Message>;
}

export type PropertiesOnly<T> = {
  [K in keyof T as T[K] extends CallableFunction ? never : K]: T[K];
};

export type ParsedCommandData = CommandConfig & PropertiesOnly<SlashCommandBuilder> & { run: RunFunction };

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