/* eslint-disable no-var */
import { Logger } from '@/helpers/classes';

declare global {
    var logger: Logger;

    interface String {
        change(replacements: { [key: string]: unknown }): string;
    }
}
