import 'dotenv/config';
import 'module-alias/register';

import yargs from 'yargs';
import Client from '@/loaders/base';
import { Logger } from '@/helpers/classes';

interface StartOptions {
    redeployCommands: boolean;
    redeploy: boolean;
    env: string;
}

const argv = yargs.argv as Partial<StartOptions>;
new Logger();

const redeployCommands = argv.redeployCommands || argv.redeploy;
process.env.NODE_ENV = argv.env || process.env.NODE_ENV || 'development';

new Client().start({
    registerCommands: !!redeployCommands
});