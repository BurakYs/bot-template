// TODO: FIX THIS FILE, ADD SUBCOMMANDS AND SUBCOMMANDGROUPS

import { SlashCommandAttachmentOption, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandIntegerOption, SlashCommandMentionableOption, SlashCommandNumberOption, SlashCommandRoleOption, SlashCommandStringOption, SlashCommandUserOption } from 'discord.js';
import { Interaction } from '@/interfaces';
import Client from '@/loaders/base';

type RunFunction = (args: { client: Client, interaction: Interaction, translations: Record<string, any> }) => Promise<any>;

export default class CommandBuilder extends SlashCommandBuilder {
    category?: string;
    tags?: string[];
    guildOnly?: boolean;
    ownerOnly?: boolean;
    dmOnly?: boolean;
    memberPermission?: string;
    botPermission?: string;
    disabled?: boolean;
    supportServerOnly?: boolean;
    run!: RunFunction;

    setCategory(category: string) {
        this.category = category;
        return this;
    }

    setTags(tags: string[]) {
        this.tags = tags;
        return this;
    }

    setGuildOnly(guildOnly: boolean) {
        this.guildOnly = guildOnly;
        return this;
    }

    setOwnerOnly(ownerOnly: boolean) {
        this.ownerOnly = ownerOnly;
        return this;
    }

    setDMOnly(dmOnly: boolean) {
        this.dmOnly = dmOnly;
        return this;
    }

    setMemberPermission(permission: string) {
        this.memberPermission = permission;
        return this;
    }

    setBotPermission(permission: string) {
        this.botPermission = permission;
        return this;
    }

    setDisabled(disabled: boolean) {
        this.disabled = disabled;
        return this;
    }

    setSupportServerOnly(supportServerOnly: boolean) {
        this.supportServerOnly = supportServerOnly;
        return this;
    }

    setRun(run: RunFunction) {
        this.run = run;
        return this;
    }

    match(interaction: Interaction) {
        const interactionSubcommandGroup = interaction.options.getSubcommandGroup(false);
        const interactionSubcommand = interaction.options.getSubcommand(false);

        const findOption = (options: any[], name: string | null) => options.find(option => option.data.name === name);
        const command = interactionSubcommandGroup
            ? findOption(findOption(this.options, interactionSubcommandGroup)?.options || [], interactionSubcommand)
            : findOption(this.options, interactionSubcommand) || this;

        return {
            category: command.category ?? this.category,
            tags: command.tags ?? this.tags,
            guildOnly: command.guildOnly ?? this.guildOnly,
            ownerOnly: command.ownerOnly ?? this.ownerOnly,
            dmOnly: command.dmOnly ?? this.dmOnly,
            memberPermission: command.memberPermission ?? this.memberPermission,
            botPermission: command.botPermission ?? this.botPermission,
            disabled: command.disabled ?? this.disabled,
            supportServerOnly: command.supportServerOnly ?? this.supportServerOnly,
            run: this.run
        };
    }

    addAttachmentOption(input: SlashCommandAttachmentOption | ((builder: SlashCommandAttachmentOption) => SlashCommandAttachmentOption)): this {
        super.addAttachmentOption(input);
        return this;
    }

    addBooleanOption(input: SlashCommandBooleanOption | ((builder: SlashCommandBooleanOption) => SlashCommandBooleanOption)): this {
        super.addBooleanOption(input);
        return this;
    }

    addStringOption(input: SlashCommandStringOption | ((builder: SlashCommandStringOption) => SlashCommandStringOption)): this {
        super.addStringOption(input);
        return this;
    }

    addChannelOption(input: SlashCommandChannelOption | ((builder: SlashCommandChannelOption) => SlashCommandChannelOption)): this {
        super.addChannelOption(input);
        return this;
    }

    addIntegerOption(input: SlashCommandIntegerOption | ((builder: SlashCommandIntegerOption) => SlashCommandIntegerOption)): this {
        super.addIntegerOption(input);
        return this;
    }

    addMentionableOption(input: SlashCommandMentionableOption | ((builder: SlashCommandMentionableOption) => SlashCommandMentionableOption)): this {
        super.addMentionableOption(input);
        return this;
    }

    addNumberOption(input: SlashCommandNumberOption | ((builder: SlashCommandNumberOption) => SlashCommandNumberOption)): this {
        super.addNumberOption(input);
        return this;
    }

    addRoleOption(input: SlashCommandRoleOption | ((builder: SlashCommandRoleOption) => SlashCommandRoleOption)): this {
        super.addRoleOption(input);
        return this;
    }

    addUserOption(input: SlashCommandUserOption | ((builder: SlashCommandUserOption) => SlashCommandUserOption)): this {
        super.addUserOption(input);
        return this;
    }
}