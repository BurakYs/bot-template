import 'dotenv/config';
import 'module-alias/register';
import '@/utils/classes/Logger';
import '@/utils/checkEnvironmentVariables';

import Client from '@/loaders/client';

Client.start();