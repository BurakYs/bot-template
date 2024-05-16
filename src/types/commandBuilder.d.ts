import { SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandUserOption } from 'discord.js';
import { Interaction } from '@/interfaces';
import Client from '@/loaders/base';

type RunFunction = (args: { client: Client, interaction: Interaction, translations: Record<string, any> }) => Promise<unknown>;

// One must learn typescript to write in typescript

declare module 'discord.js' {
    type SubcommandsOnlyBuilder<T> = Omit<T, 'addBooleanOption' | 'addUserOption' | 'addChannelOption' | 'addRoleOption' | 'addAttachmentOption' | 'addMentionableOption' | 'addStringOption' | 'addIntegerOption' | 'addNumberOption'>;
    type OptionsOnlyBuilder<T> = Omit<T, 'addSubcommand' | 'addSubcommandGroup'>;

    interface SlashCommandBuilder {
        category: string;
        tags: string[];
        guildOnly: boolean;
        ownerOnly: boolean;
        dmOnly: boolean;
        memberPermission: string;
        botPermission: string;
        disabled: boolean;
        supportServerOnly: boolean;
        run: RunFunction;

        setCategory(category: string): this;

        setTags(tags: string[]): this;

        setGuildOnly(guildOnly: boolean): this;

        setOwnerOnly(ownerOnly: boolean): this;

        setDMOnly(dmOnly: boolean): this;

        setMemberPermission(permission: string): this;

        setBotPermission(permission: string): this;

        setDisabled(disabled: boolean): this;

        setSupportServerOnly(supportServerOnly: boolean): this;

        addBooleanOption(input: SlashCommandBooleanOption | ((builder: SlashCommandBooleanOption) => SlashCommandBooleanOption)): OptionsOnlyBuilder<this>;

        addUserOption(input: SlashCommandUserOption | ((builder: SlashCommandUserOption) => SlashCommandUserOption)): OptionsOnlyBuilder<this>;

        addChannelOption(input: SlashCommandChannelOption | ((builder: SlashCommandChannelOption) => SlashCommandChannelOption)): OptionsOnlyBuilder<this>;

        addRoleOption(input: SlashCommandRoleOption | ((builder: SlashCommandRoleOption) => SlashCommandRoleOption)): OptionsOnlyBuilder<this>;

        addAttachmentOption(input: SlashCommandAttachmentOption | ((builder: SlashCommandAttachmentOption) => SlashCommandAttachmentOption)): OptionsOnlyBuilder<this>;

        addMentionableOption(input: SlashCommandMentionableOption | ((builder: SlashCommandMentionableOption) => SlashCommandMentionableOption)): OptionsOnlyBuilder<this>;

        addStringOption(input: SlashCommandStringOption | ((builder: SlashCommandStringOption) => SlashCommandStringOption)): OptionsOnlyBuilder<this>;

        addIntegerOption(input: SlashCommandIntegerOption | ((builder: SlashCommandIntegerOption) => SlashCommandIntegerOption)): OptionsOnlyBuilder<this>;

        addNumberOption(input: SlashCommandNumberOption | ((builder: SlashCommandNumberOption) => SlashCommandNumberOption)): OptionsOnlyBuilder<this>;

        addSubcommand(input: SlashCommandSubcommandBuilder | ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)): SubcommandsOnlyBuilder<this>;

        addSubcommandGroup(input: SlashCommandSubcommandGroupBuilder | ((subcommandGroup: SlashCommandSubcommandGroupBuilder) => SlashCommandSubcommandGroupBuilder)): SubcommandsOnlyBuilder<this>;

        setRun(run: RunFunction): this;

        match(interaction: Interaction): {
            category: string;
            tags: string[];
            guildOnly: boolean;
            ownerOnly: boolean;
            dmOnly: boolean;
            memberPermission: string;
            botPermission: string;
            disabled: boolean;
            supportServerOnly: boolean;
            run: RunFunction;
        };
    }

    interface SlashCommandSubcommandBuilder {
        setCategory(category: string): this;

        setTags(tags: string[]): this;

        setGuildOnly(guildOnly: boolean): this;

        setOwnerOnly(ownerOnly: boolean): this;

        setDMOnly(dmOnly: boolean): this;

        setMemberPermission(permission: string): this;

        setBotPermission(permission: string): this;

        setDisabled(disabled: boolean): this;

        setSupportServerOnly(supportServerOnly: boolean): this;
    }

    interface SlashCommandSubcommandGroupBuilder {
        addSubcommand(input: SlashCommandSubcommandBuilder | ((subcommandGroup: SlashCommandSubcommandBuilder) => SlashCommandSubcommandBuilder)): this;
    }
}