import type ClientInstance from '@/loaders/client';
import type {
    ChatInputCommandInteraction,
    ColorResolvable,
    PermissionResolvable,
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandsOnlyBuilder
} from 'discord.js';

export type Client = typeof ClientInstance;

type PrimitiveOrDictionary<P extends boolean, T> = P extends true ? T : { [K in keyof T]: T[K] | Record<string, T[K]> };
type NonFunctionProperties<T> = { [K in keyof T as T[K] extends CallableFunction ? never : K]: T[K] };
type RunFunctionOptions = { client: Client; interaction: ChatInputCommandInteraction };
type RunFunction = (options: RunFunctionOptions) => Promise<unknown>;

export type CommandConfig<P extends boolean = false> = PrimitiveOrDictionary<
    P,
    {
        category: 'Bot' | 'Moderation' | 'Admin';
        guildOnly?: boolean;
        dmOnly?: boolean;
        supportServerOnly?: boolean;
        memberPermissions?: PermissionResolvable[];
        botPermissions?: PermissionResolvable[];
        botAdminsOnly?: boolean;
        disabled?: boolean;
    }
>;

export type CommandData = {
    data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
    config: CommandConfig;
    run: RunFunction;
};

export type ResolvedCommandData = CommandConfig<true> & NonFunctionProperties<SlashCommandBuilder> & { run: RunFunction };

export type EventData = {
    name: string;
    once?: boolean;
    dontLoad?: boolean;
    run: CallableFunction;
};

export type CustomMessageOptions = {
    content: string;
    title: string;
    author: { name: string; iconURL?: string };
    description: string;
    fields: { name: string; value: string; inline?: boolean }[];
    color: ColorResolvable;
    thumbnail: string;
    image: string;
    footer: { text: string; iconURL?: string };
    ephemeral: boolean;
};
