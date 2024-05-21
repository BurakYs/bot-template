import { EmbedBuilder } from 'discord.js';
import { Database } from '@/helpers/classes';
import { Interaction, SendMessageOptions } from '@/interfaces';
import config from '@/config';

const languages: Record<string, Database> = {
    'tr': new Database({ path: './src/localizations/tr.json', cache: true }),
    'en-US': new Database({ path: './src/localizations/en.json', cache: true })
};
languages['en-GB'] = languages['en-US'];
languages['en'] = languages['en-US'];

export default class Utils {
    static createTitle(title: string | null | undefined, defaultTitle: string, emoji: string) {
        if (title?.includes(':')) return title;

        if (Math.random() < 0.9) {
            title ||= defaultTitle;
            title = Math.random() < 0.5 ? title + ` ${emoji}` : `${emoji} ` + title;
        } else if (Math.random() < 0.25) {
            title = null;
        }

        return title;
    }

    static getTranslations(interaction: Interaction, path: string) {
        const { defaultLanguage } = config.bot;
        const defaultTranslations = languages[defaultLanguage].get(path);
        const translations = (languages[interaction.language || interaction.locale] || languages[defaultLanguage]).get(path);

        return translations || defaultTranslations;
    }

    static randomArray<T>(array: T[]) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static async sendError(interaction: Interaction, options: Partial<SendMessageOptions>) {
        return await this.sendEmbed(interaction, { ...options, embedType: 'error' });
    }

    static async sendSuccess(interaction: Interaction, options: Partial<SendMessageOptions>) {
        return await this.sendEmbed(interaction, { ...options, embedType: 'success' });
    }

    private static async sendEmbed(interaction: Interaction, options: Partial<SendMessageOptions> & { embedType: 'error' | 'success' }) {
        const action = interaction.deferred || interaction.replied ? 'editReply' : options.type || 'reply';
        const randomTitle = Utils.getTranslations(interaction, options.embedType === 'error' ? 'embeds.errorTitles' : 'embeds.successTitles');

        options.title = Utils.createTitle(options.title, Utils.randomArray(randomTitle), options.embedType === 'error' ? ':x:' : ':white_check_mark:');
        options.thumbnail = typeof options.thumbnail === 'object' ? options.thumbnail.url : options.thumbnail;
        options.image = typeof options.image === 'object' ? options.image.url : options.image;

        if (options.noEmbed && !Object.keys(options.fields || {}).length)
            return await interaction[action]({
                content: `${options.title ? `## ${options.title}\n` : ''}${options.description}${options.footer ? `\n\n${options.footer ? options.footer.text : null}` : ''}`,
                allowedMentions: { parse: [] },
                ephemeral: options.ephemeral || false
            });

        return await interaction[action]({
            content: options.content || undefined,
            embeds: [new EmbedBuilder()
                .setAuthor(options.author || null)
                .setThumbnail(options.thumbnail || null)
                .setImage(options.image || null)
                .setTitle(options.title || null)
                .setColor(options.color || config.embedColors[options.embedType])
                .setDescription(options.description || null)
                .setFooter(options.footer || null)
                .setFields(options.fields || [])
            ],
            ephemeral: options.ephemeral || false,
            components: []
        });
    }
}