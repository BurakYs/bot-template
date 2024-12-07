import 'dotenv/config';
import 'module-alias/register';
import '@/utils/classes/Logger';

import CommandLoader from '@/loaders/command';
import checkEnvironmentVariables from '@/utils/checkEnvironmentVariables';

checkEnvironmentVariables();

CommandLoader.loadCommands(true);