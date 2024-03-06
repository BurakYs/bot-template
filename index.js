const config = require('./config.js');
const startArgs = process.argv.slice(2);
config.bot.redeployCommands = ['--redeploy-commands', '-rc', '--redeploy', '-r']
	.some(arg => startArgs.includes(arg));

const Logger = require('./utils/logger.js');
new Logger();

logger.info('Starting the project');

const dotenv = require('dotenv');
dotenv.config();

const Base = require('./loaders/base.js');
new Base().create().loader();