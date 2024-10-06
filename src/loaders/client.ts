import { ChatInputCommandInteraction, Client as DiscordClient, GatewayIntentBits, Message, MessageComponentInteraction, OAuth2Scopes, PermissionsBitField } from 'discord.js';
import config from '@/config';
import sendEmbed from '@/utils/sendEmbed';

import type { CommandData, SendMessageOptions } from '@/types';

type StartOptions = {
  registerCommands: boolean;
}

class Client extends DiscordClient<true> {
  commands: CommandData[] = [];
  commandMentions: Record<string, string> = {};

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds
      ],
      presence: {
        status: config.presence.status
      }
    });
  }

  create() {
    this.commands = [];

    process.on('unhandledRejection', (error) => global.logger.error(error));
    process.on('uncaughtException', (error) => global.logger.error(error));

    return this;
  }

  async start(options: Partial<StartOptions>) {
    if (!process.env.TOKEN) {
      global.logger.fatal('Please set the TOKEN in the .env file');
      process.exit(1);
    }

    if (options.registerCommands) {
      await (await import('@/loaders/command')).default.loadCommands({ register: true });
      process.exit(0);
    }

    this.create();
    this.extendPrototypes();

    await this.login(process.env.TOKEN).catch((error) => {
      global.logger.error(error);
      process.exit(1);
    });

    this.once('ready', async (client) => {
      global.logger.info(`Logged in as ${client.user.tag}`);

      await (await import('@/loaders/command')).default.loadCommands({ client: this });
      await (await import('@/loaders/event')).default(this);

      this.setPresence();

      setInterval(() => {
        this.setPresence();
      }, 60000);
    });
  }

  setPresence() {
    config.presence.activities[0].state = config.presence.activities[0].state
      .replace(/{u}/g, this.guilds.cache.reduce((a, g) => a + g.memberCount, 0).toLocaleString())
      .replace(/{s}/g, this.guilds.cache.size.toString());

    return this.user.setPresence(config.presence);
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

  extendPrototypes() {
    [Message.prototype, ChatInputCommandInteraction.prototype, MessageComponentInteraction.prototype].forEach((prototype) => {
      Object.defineProperties(prototype, {
        error: {
          value(options: Partial<SendMessageOptions>) {
            return sendEmbed(this, { ...options, embedType: 'error' });
          }
        },
        success: {
          value(options: Partial<SendMessageOptions>) {
            return sendEmbed(this, { ...options, embedType: 'success' });
          }
        }
      });
    });
  }
}

const client = new Client();
export default client;