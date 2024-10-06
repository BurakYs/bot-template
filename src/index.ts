import 'dotenv/config';
import 'module-alias/register';
import '@/utils/classes/Logger';

import Client from '@/loaders/client';
import yargs from 'yargs';

type ProcessArgv = {
  redeployCommands: boolean;
  redeploy: boolean;
}

const argv = yargs.argv as Partial<ProcessArgv>;
Client.start({
  registerCommands: !!argv.redeployCommands
});