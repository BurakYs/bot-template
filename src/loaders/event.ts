import { glob } from 'glob';
import type { Client, EventData } from '@/types';

export default async (client: Client) => {
    const eventFiles = await glob('./src/events/**/*.ts');

    eventFiles.map(async (value) => {
        // biome-ignore lint/suspicious/noExplicitAny: We don't know the type of the imported event file
        const event: EventData<any> = (await import(`../../${value.replace(/\\/g, '/')}`)).default;
        if (event.dontLoad) return;

        client[event.once ? 'once' : 'on'](event.name, (...params) => event.run(client, ...params));
    });
};
