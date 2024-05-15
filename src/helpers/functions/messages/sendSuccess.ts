import { EmbedBuilder } from 'discord.js';
import { Interaction, SendMessageOptions } from '@/interfaces';
import { createTitle, getTranslations } from '@/helpers/functions';
import config from '@/config';

export default async function (interaction: Interaction, options: Partial<SendMessageOptions>) {
    const action = interaction.deferred || interaction.replied ? 'editReply' : options.type || 'reply';
    const randomTitle = getTranslations(interaction, 'embeds.successTitles').random();
    options.title = createTitle(options.title, randomTitle, ':white_check_mark:');
    // @ts-ignore
    options.thumbnail = options.thumbnail?.url || options.thumbnail;
    // @ts-ignore
    options.image = options.image?.url || options.image;

    if (options.noEmbed && !Object.keys(options.fields || {}).length)
        return interaction[action]({
            content: `${options.title ? `## ${options.title}\n` : ''}${options.description}${options.footer ? `\n\n${typeof options.footer === 'object' ? options.footer.text : options.footer || null}` : ''}`,
            allowedMentions: { parse: [] },
            ephemeral: options.ephemeral || false
        });

    return interaction[action]({
        content: options.content || undefined,
        embeds: [new EmbedBuilder()
            .setAuthor(options.author || null)
            .setThumbnail(options.thumbnail || null)
            .setImage(options.image || null)
            .setTitle(options.title || randomTitle)
            .setColor(options.color || config.embedColors.success)
            .setDescription(options.description || null)
            .setFooter(options.footer || null)
            .addFields(options.fields || [])
        ],
        ephemeral: options.ephemeral || false,
        components: []
    }).catch(() => null);
}