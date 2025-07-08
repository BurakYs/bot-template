import { type ChatInputCommandInteraction, EmbedBuilder, type InteractionEditReplyOptions, type InteractionReplyOptions, MessageFlags } from 'discord.js';
import config from '@/config';
import type { CustomMessageOptions } from '@/types';
import { randomFromArray } from '@/utils';

export default async function sendEmbed(interaction: ChatInputCommandInteraction, options: Partial<CustomMessageOptions> & { embedType: 'error' | 'success' }) {
    const action = interaction.deferred || interaction.replied ? 'editReply' : 'reply';

    const embedTitles = interaction.translate(`embedTitles.${options.embedType}`, { returnObjects: true });
    const embedEmoji = options.embedType === 'error' ? ':x:' : ':white_check_mark:';

    options.title = `${embedEmoji} ${options.title || randomFromArray(embedTitles)}`;
    options.color ??= config.embedColors[options.embedType];

    const messagePayload: InteractionReplyOptions | InteractionEditReplyOptions = {
        content: options.content || undefined,
        embeds: [
            new EmbedBuilder()
                .setAuthor(options.author || null)
                .setThumbnail(options.thumbnail || null)
                .setImage(options.image || null)
                .setTitle(options.title || null)
                .setColor(options.color || null)
                .setDescription(options.description || null)
                .setFooter(options.footer || null)
                .setFields(options.fields || [])
        ],
        components: []
    };

    if (action === 'reply' && options.ephemeral) {
        messagePayload.flags = [MessageFlags.Ephemeral];
    }

    return interaction[action](messagePayload as never);
}
