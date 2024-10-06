import 'dotenv/config';
import 'module-alias/register';
import Logger from '@/utils/classes/Logger';
import Client from '@/loaders/client';
import yargs from 'yargs';

type StartOptions = {
  redeployCommands: boolean;
  redeploy: boolean;
}

const argv = yargs.argv as Partial<StartOptions>;

global.logger = new Logger();

Client.start({
  registerCommands: !!(argv.redeployCommands || argv.redeploy)
});