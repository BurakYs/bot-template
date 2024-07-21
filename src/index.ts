import 'dotenv/config';
import 'module-alias/register';

import Client from '@/loaders/base';
import { Logger } from '@/helpers/classes';
import yargs from 'yargs';

type StartOptions = {
  redeployCommands: boolean;
  redeploy: boolean;
  env: string;
}

const argv = yargs.argv as Partial<StartOptions>;
const redeployCommands = argv.redeployCommands || argv.redeploy;
process.env.NODE_ENV = argv.env || process.env.NODE_ENV || 'development';

new Logger();
new Client().start({
  registerCommands: !!redeployCommands
});