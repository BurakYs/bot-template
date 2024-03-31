const config = require('./config.js');
const startArgs = process.argv.slice(2);
config.bot.redeployCommands = ['--redeploy-commands', '-rc', '--redeploy', '-r']
	.some(arg => startArgs.includes(arg));

const { Logger } = require('./helpers/classes');
new Logger();

const dotenv = require('dotenv');
dotenv.config();

logger.info('Starting the bot');
const Client = require('./loaders/base');
new Client().create().loader();