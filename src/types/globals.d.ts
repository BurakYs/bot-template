/* eslint-disable no-var */
import { Logger } from '@/helpers/classes';
import Base from '@/loaders/base';

declare global {
    var logger: Logger;
    var client: Base;
    var commands: any[];

    interface String {
        title(language?: string): string;
        change(replacements?: { [key: string]: any }): string;
    }
}