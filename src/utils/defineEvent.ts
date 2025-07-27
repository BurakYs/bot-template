import type { ClientEvents } from 'discord.js';
import type { EventData } from '@/types';

export default function defineEvent<T extends keyof ClientEvents>(event: EventData<T>): EventData<T> {
    return event;
}
