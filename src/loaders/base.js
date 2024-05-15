const { Client: DiscordClient, GatewayIntentBits, OAuth2Scopes, Partials, ActivityType } = require('discord.js');
const config = require('@/config');

module.exports = class extends DiscordClient {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds
            ],
            scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            partials: [Partials.Message, Partials.Channel, Partials.User]
        });
    }

    async start(options = {}) {
        if (!process.env.TOKEN) return logger.fatal('Don\'t forget to set the TOKEN in the .env file.');

        try {
            this.create();
            ['array', 'date', 'number', 'string', 'message', 'SlashCommandBuilder'].forEach(extension => require(`@/helpers/extensions/${extension}`)());

            await this.login(process.env.TOKEN);

            this.once('ready', async () => {
                logger.info(`Logged in as ${client.user.tag}`);

                await require('./command').loadCommands(this, options.registerCommands);
                await require('./event')(this);

                this.setPresence();
                setInterval(async () => {
                    await this.setPresence();
                }, 60000);
            });
        } catch (e) {
            logger.error(e);
        }
    }

    create() {
        global.client = this;
        this.commands = [];

        process.on('unhandledRejection', (error) => logger.error(error));
        process.on('uncaughtException', (error) => logger.error(error));

        return this;
    }

    setPresence() {
        const { activity, status } = config.presence;
        const activityName = activity
            .replaceAll('{u}', client.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString())
            .replaceAll('{s}', client.guilds.cache.size);

        return client.user.setPresence({
            activities: [{
                name: activityName,
                type: ActivityType.Custom,
                state: activityName
            }],
            status: status
        });
    }
};