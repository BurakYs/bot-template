import config from '@/config';
import { randomFromArray } from '@/utils';
import { type ChatInputCommandInteraction, type ColorResolvable, EmbedBuilder, MessageFlags } from 'discord.js';

import type { CustomMessageOptions } from '@/types';

export default function sendEmbed(interaction: ChatInputCommandInteraction, options: Partial<CustomMessageOptions> & { embedType: 'error' | 'success' }) {
    const action = interaction.deferred || interaction.replied ? 'editReply' : 'reply';

    const embedTitles = interaction.translate(`embedTitles.${options.embedType}`, { returnObjects: true });
    const embedEmoji = options.embedType === 'error' ? ':x:' : ':white_check_mark:';

    options.title = `${embedEmoji} ${options.title || randomFromArray(embedTitles)}`;
    options.color ??= config.embedColors[options.embedType];

    return interaction[action]({
        content: options.content || undefined,
        embeds: [
            new EmbedBuilder()
                .setAuthor(options.author || null)
                .setThumbnail(options.thumbnail || null)
                .setImage(options.image || null)
                .setTitle(options.title || null)
                .setColor(options.color as ColorResolvable)
                .setDescription(options.description || null)
                .setFooter(options.footer || null)
                .setFields(options.fields || [])
        ],
        flags: options.ephemeral ? [MessageFlags.Ephemeral] : [],
        components: []
    });
}
