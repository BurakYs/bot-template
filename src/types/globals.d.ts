/* eslint-disable no-var */
import { Logger } from '@/helpers/classes';
import Client from '@/loaders/base';

declare global {
    var logger: Logger;
    var client: Client;

    interface String {
        title(language?: string): string;
        change(replacements: { [key: string]: unknown }): string;
    }
}
