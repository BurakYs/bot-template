import 'dotenv/config';
import 'module-alias/register';
import '@/utils/classes/Logger';
import '@/utils/checkEnvironmentVariables';

import CommandLoader from '@/loaders/command';

CommandLoader.loadCommands(true);