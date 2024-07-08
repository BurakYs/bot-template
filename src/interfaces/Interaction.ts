import { ChatInputCommandInteraction, Message } from 'discord.js';
import { SendMessageOptions } from '@/interfaces';

export default interface Interaction extends ChatInputCommandInteraction {
  language?: string;
  success: (options: Partial<SendMessageOptions>) => Promise<Message>;
  error: (options: Partial<SendMessageOptions>) => Promise<Message>;
}