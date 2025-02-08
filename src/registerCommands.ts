import 'dotenv/config';
import 'module-alias/register';
import '@/utils/setupLogger';
import '@/utils/checkEnvironmentVariables';

import CommandLoader from '@/loaders/command';

CommandLoader.loadCommands(true);