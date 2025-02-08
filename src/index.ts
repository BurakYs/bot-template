import 'dotenv/config';
import 'module-alias/register';
import '@/utils/setupLogger';
import '@/utils/checkEnvironmentVariables';

import Client from '@/loaders/client';

process.on('unhandledRejection', (e) => global.logger.error(e));
process.on('uncaughtException', (e) => global.logger.error(e));

Client.start();