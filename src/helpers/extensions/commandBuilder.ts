import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { Interaction } from '@/interfaces';
import Client from '@/loaders/base';

type RunFunction = (args: { client: Client, interaction: Interaction, translations: Record<string, any> }) => Promise<unknown>;

export default function () {
    Object.defineProperties(SlashCommandBuilder.prototype, {
        setCategory: {
            value: function (category: string) {
                this.category = category;
                return this;
            }
        },
        setTags: {
            value: function (tags: string[]) {
                this.tags = tags;
                return this;
            }
        },
        setGuildOnly: {
            value: function (guildOnly: boolean) {
                this.guildOnly = guildOnly;
                return this;
            }
        },
        setOwnerOnly: {
            value: function (ownerOnly: boolean) {
                this.ownerOnly = ownerOnly;
                return this;
            }
        },
        setDMOnly: {
            value: function (dmOnly: boolean) {
                this.dmOnly = dmOnly;
                return this;
            }
        },
        setMemberPermission: {
            value: function (permission: string) {
                this.memberPermission = permission;
                return this;
            }
        },
        setBotPermission: {
            value: function (permission: string) {
                this.botPermission = permission;
                return this;
            }
        },
        setDisabled: {
            value: function (disabled: boolean) {
                this.disabled = disabled;
                return this;
            }
        },
        setSupportServerOnly: {
            value: function (supportServerOnly: boolean) {
                this.supportServerOnly = supportServerOnly;
                return this;
            }
        },
        setRun: {
            value: function (run: RunFunction) {
                this.run = run;
                return this;
            }
        },
        match: {
            value: function (interaction: Interaction) {
                const interactionSubcommandGroup = interaction.options.getSubcommandGroup(false);
                const interactionSubcommand = interaction.options.getSubcommand(false);

                const findOption = (options: any[], name: string | null) => options.find(option => option.name === name);
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
        }
    });
    Object.defineProperties(SlashCommandSubcommandBuilder.prototype, {
        setCategory: {
            value: function (category: string) {
                this.category = category;
                return this;
            }
        },
        setTags: {
            value: function (tags: string[]) {
                this.tags = tags;
                return this;
            }
        },
        setGuildOnly: {
            value: function (guildOnly: boolean) {
                this.guildOnly = guildOnly;
                return this;
            }
        },
        setOwnerOnly: {
            value: function (ownerOnly: boolean) {
                this.ownerOnly = ownerOnly;
                return this;
            }
        },
        setDMOnly: {
            value: function (dmOnly: boolean) {
                this.dmOnly = dmOnly;
                return this;
            }
        },
        setMemberPermission: {
            value: function (permission: string) {
                this.memberPermission = permission;
                return this;
            }
        },
        setBotPermission: {
            value: function (permission: string) {
                this.botPermission = permission;
                return this;
            }
        },
        setDisabled: {
            value: function (disabled: boolean) {
                this.disabled = disabled;
                return this;
            }
        },
        setSupportServerOnly: {
            value: function (supportServerOnly: boolean) {
                this.supportServerOnly = supportServerOnly;
                return this;
            }
        },
        setRun: {
            value: function (run: RunFunction) {
                this.run = run;
                return this;
            }
        },
        match: {
            value: function (interaction: Interaction) {
                const interactionSubcommandGroup = interaction.options.getSubcommandGroup(false);
                const interactionSubcommand = interaction.options.getSubcommand(false);

                const findOption = (options: any[], name: string | null) => options.find(option => option.name === name);
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
        }
    });
}