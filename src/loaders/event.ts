import { glob } from 'glob';
import Client from '@/loaders/base';

export default async (client: Client) => {
    const eventFiles = await glob('./dist/events/**/*.js');

    eventFiles.map(async (value) => {
        const event = (await import(`../../${value.replace(/\\/g, '/')}`)).default;
        if (!event.load) return;

        client[event.once ? 'once' : 'on'](event.name, (...params) => event.run(client, ...params));
    });
};