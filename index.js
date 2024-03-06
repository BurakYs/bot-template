const Logger = require('./utils/logger.js');
new Logger();

logger.info('Starting the project');

const dotenv = require('dotenv');
dotenv.config();

const Base = require('./loaders/base.js');
new Base().create().loader();