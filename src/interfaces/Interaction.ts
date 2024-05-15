/* eslint-disable semi */
import { ChatInputCommandInteraction } from 'discord.js';
import { SendMessageOptions } from '@/interfaces';

export default interface Interaction extends ChatInputCommandInteraction {
    language?: string;
    success: (options: Partial<SendMessageOptions>) => Promise<void>;
    error: (options: Partial<SendMessageOptions>) => Promise<void>;
}