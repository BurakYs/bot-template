import { type ChatInputCommandInteraction, type ColorResolvable, EmbedBuilder } from 'discord.js';
import config from '@/config';
import randomFromArray from '@/utils/randomFromArray';
import getTranslations from '@/utils/getTranslations';

import type { CustomMessageOptions } from '@/types';

function createTitle(titleTemplate = '', defaultTitle: string, emoji: string) {
  if (titleTemplate.includes(':')) return titleTemplate;

  let title: string | undefined = titleTemplate;

  if (Math.random() < 0.9) {
    title ||= defaultTitle;
    title = Math.random() < 0.5 ? title + ` ${emoji}` : `${emoji} ` + title;
  } else if (Math.random() < 0.25) {
    title = undefined;
  }

  return title;
}

export default function sendEmbed(interaction: ChatInputCommandInteraction, options: Partial<CustomMessageOptions> & { embedType: 'error' | 'success' }) {
  const action = options.action || (interaction.deferred || interaction.replied ? 'editReply' : 'reply');

  const embedTitles = getTranslations(interaction, `embeds.${options.embedType}Titles`);
  const embedEmoji = options.embedType === 'error' ? ':x:' : ':white_check_mark:';

  options.title = createTitle(options.title, randomFromArray(embedTitles), embedEmoji);
  options.color ??= config.embedColors[options.embedType];

  return interaction[action]({
    content: options.content || undefined,
    embeds: [new EmbedBuilder()
      .setAuthor(options.author || null)
      .setThumbnail(options.thumbnail || null)
      .setImage(options.image || null)
      .setTitle(options.title || null)
      .setColor(options.color as ColorResolvable)
      .setDescription(options.description || null)
      .setFooter(options.footer || null)
      .setFields(options.fields || [])
    ],
    ephemeral: options.ephemeral || false,
    components: []
  });
}