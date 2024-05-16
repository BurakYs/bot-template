import { ActivityType, Client as DiscordClient, ClientPresenceStatus, GatewayIntentBits, Partials } from 'discord.js';
import { CommandData } from '@/interfaces';
import config from '@/config';

interface StartOptions {
    registerCommands: boolean;
}

export default class Client extends DiscordClient {
    commands: CommandData[] = [];
    commandMentions: Record<string, string> = {};

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds
            ],
            presence: {
                status: config.presence.status as ClientPresenceStatus,
                activities: [{
                    name: config.presence.activity,
                    state: config.presence.activity,
                    type: ActivityType.Custom
                }]
            },
            partials: [Partials.Message, Partials.Channel, Partials.User]
        });
    }

    async start(options: Partial<StartOptions>) {
        if (!process.env.TOKEN) {
            logger.fatal('Don\'t forget to set the TOKEN in the .env file.');
            process.exit(1);
        }

        this.create();

        for (const extension of ['string', 'message', 'commandBuilder']) {
            (await import(`@/helpers/extensions/${extension}`)).default(this);
        }

        await this.login(process.env.TOKEN);

        this.once('ready', async (client) => {
            logger.info(`Logged in as ${client.user.tag}`);

            await (await import('@/loaders/command')).default.loadCommands(this, !!options.registerCommands);
            await (await import('@/loaders/event')).default(this);

            setInterval(() => {
                this.setPresence();
            }, 60000);
        });

        return this;
    }

    create() {
        this.commands = [];

        process.on('unhandledRejection', (error) => logger.error(error));
        process.on('uncaughtException', (error) => logger.error(error));

        return this;
    }

    setPresence() {
        const activityName = config.presence.activity
            .replace(/{u}/g, this.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString())
            .replace(/{s}/g, this.guilds.cache.size.toString());

        return this.user!.setPresence({
            status: config.presence.status as ClientPresenceStatus,
            activities: [{
                name: activityName,
                type: ActivityType.Custom,
                state: activityName
            }]
        });
    }
}