import { Message } from 'discord.js';
import { SendMessageOptions } from '@/types/index';

declare module 'discord.js' {
  interface CommandInteraction {
    language: string;
  }

  interface ChatInputCommandInteraction {
    success: (options: Partial<SendMessageOptions>) => Promise<Message>;
    error: (options: Partial<SendMessageOptions>) => Promise<Message>;
  }
}