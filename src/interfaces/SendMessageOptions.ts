import type { ColorResolvable } from 'discord.js';

export default interface SendMessageOptions {
  title: string | null;
  thumbnail: string | { url: string };
  image: string | { url: string };
  noEmbed: boolean;
  content: string | null;
  author: { name: string; iconURL?: string } | null;
  color: ColorResolvable;
  description: string;
  footer: { text: string; iconURL?: string };
  fields: { name: string; value: string; inline?: boolean }[];
  ephemeral: boolean;
  type: 'reply' | 'editReply' | 'followUp';
}