import { Message } from 'discord.js';
import { CustomMessageOptions } from '@/types/index';

declare module 'discord.js' {
  interface BaseInteraction {
    language: string;
    success: (options: Partial<CustomMessageOptions>) => Promise<Message>;
    error: (options: Partial<CustomMessageOptions>) => Promise<Message>;
  }
}