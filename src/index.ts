import 'dotenv/config';
import 'module-alias/register';
import '@/utils/classes/Logger';

import Client from '@/loaders/client';
import checkEnvironmentVariables from '@/utils/checkEnvironmentVariables';

checkEnvironmentVariables();

Client.start();