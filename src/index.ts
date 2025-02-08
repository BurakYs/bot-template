import 'dotenv/config';
import 'module-alias/register';
import '@/utils/setupLogger';
import '@/utils/checkEnvironmentVariables';

import Client from '@/loaders/client';

Client.start();