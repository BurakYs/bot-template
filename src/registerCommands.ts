import 'dotenv/config';
import '@/utils/setupLogger';
import '@/utils/checkEnvironmentVariables';

import CommandLoader from '@/loaders/command';

CommandLoader.loadCommands(true);
