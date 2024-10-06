import { EmbedBuilder, type ColorResolvable } from 'discord.js';
import config from '@/config';
import randomArray from '@/utils/randomArray';
import getTranslations from '@/utils/getTranslations';

import type { Interaction, SendMessageOptions } from '@/types';

function createTitle(titleTemplate: string, defaultTitle: string, emoji: string) {
  if (titleTemplate?.includes(':')) return titleTemplate;
  let title: string | null = titleTemplate;

  if (Math.random() < 0.9) {
    title ||= defaultTitle;
    title = Math.random() < 0.5 ? title + ` ${emoji}` : `${emoji} ` + title;
  } else if (Math.random() < 0.25) {
    title = null;
  }

  return title;
}

export default function sendEmbed(interaction: Interaction, options: Partial<SendMessageOptions> & { embedType: 'error' | 'success' }) {
  const action = options.action || interaction.deferred || interaction.replied ? 'editReply' : 'reply';
  const randomTitle = getTranslations(interaction, `embeds.${options.embedType}Titles`);

  options.title = createTitle(options.title || '', randomArray(randomTitle), options.embedType === 'error' ? ':x:' : ':white_check_mark:') || undefined;
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