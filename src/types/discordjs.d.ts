import { Message } from 'discord.js';
import { CustomMessageOptions } from '@/types/index';
import { TFunction } from 'i18next';

declare module 'discord.js' {
  interface BaseInteraction {
    language: string;
    success: (options: Partial<CustomMessageOptions>) => Promise<Message>;
    error: (options: Partial<CustomMessageOptions>) => Promise<Message>;
    translate: TFunction;
  }
}