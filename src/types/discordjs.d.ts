import type { CustomMessageOptions } from '@/types/index';
import type { Message } from 'discord.js';
import type { TFunction } from 'i18next';

declare module 'discord.js' {
    interface BaseInteraction {
        language: string;
        translate: TFunction;

        success(options: Partial<CustomMessageOptions>): Promise<Message>;
        success(message: string): Promise<Message>;

        error(options: Partial<CustomMessageOptions>): Promise<Message>;
        error(message: string): Promise<Message>;
    }
}
