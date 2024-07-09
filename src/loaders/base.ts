import { ActivityType, Client as DiscordClient, type ClientPresenceStatus, GatewayIntentBits, OAuth2Scopes, Partials, PermissionsBitField } from 'discord.js';
import config from '@/config';

import type { CommandData } from '@/interfaces';

interface StartOptions {
  registerCommands: boolean;
}

export default class Client extends DiscordClient<true> {
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
      logger.fatal('You must set the TOKEN in the .env file.');
      process.exit(1);
    }

    if (options.registerCommands) {
      await (await import('@/loaders/command')).default.loadCommands({ register: true });
      process.exit(0);
    }

    this.create();

    for (const extension of ['string', 'message']) {
      (await import(`@/helpers/extensions/${extension}`)).default(this);
    }

    await this.login(process.env.TOKEN);

    this.once('ready', async (client) => {
      logger.info(`Logged in as ${client.user.tag}`);

      await (await import('@/loaders/command')).default.loadCommands({ client: this });
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

    return this.user.setPresence({
      status: config.presence.status as ClientPresenceStatus,
      activities: [{
        name: activityName,
        type: ActivityType.Custom,
        state: activityName
      }]
    });
  }

  getInviteURL() {
    return this.generateInvite({
      permissions: [
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.SendMessagesInThreads,
        PermissionsBitField.Flags.EmbedLinks,
        PermissionsBitField.Flags.AttachFiles,
        PermissionsBitField.Flags.UseExternalEmojis
      ],
      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands]
    });
  }
}