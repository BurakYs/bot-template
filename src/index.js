require('dotenv/config');
require('module-alias/register');

const { argv } = require('yargs');
const Client = require('@/loaders/base');
const { Logger } = require('@/helpers/classes');
new Logger();

const redeployCommands = argv.redeployCommands || argv.redeploy;
process.env.NODE_ENV = argv.env || process.env.NODE_ENV || 'development';

new Client().start({
    registerCommands: !!redeployCommands
});