import type {
  ChatInputCommandInteraction,
  ColorResolvable,
  Message,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';
import type Client from '@/loaders/base';

export type RunFunctionOptions = { client: Client, interaction: Interaction, translations: Record<string, any> }
export type RunFunction = (options: RunFunctionOptions) => Promise<unknown>;

export type PrimitiveOrDictionary<T> = T | Record<string, T>;

export type CommandConfig = {
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

export type CommandData = {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
  config: CommandConfig;
  run: RunFunction;
}

export type Interaction = ChatInputCommandInteraction & {
  language?: string;
  success: (options: Partial<SendMessageOptions>) => Promise<Message>;
  error: (options: Partial<SendMessageOptions>) => Promise<Message>;
}

export type PropertiesOnly<T> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof T as T[K] extends Function ? never : K]: T[K];
};

export type ParsedCommandData = CommandConfig & PropertiesOnly<SlashCommandBuilder> & { run: RunFunction };

export type SendMessageOptions = {
  title: string | null;
  thumbnail: string | { url: string };
  image: string | { url: string };
  noEmbed: boolean;
  content: string | null;
  author: { name: string; iconURL?: string } | null;
  color: ColorResolvable;
  description: string;
  footer: { text: string; iconURL?: string };
  fields: { name: string; value: string; inline?: boolean }[];
  ephemeral: boolean;
  type: 'reply' | 'editReply' | 'followUp';
}