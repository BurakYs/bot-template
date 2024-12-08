import { ChatInputCommandInteraction, Client as DiscordClient, GatewayIntentBits, Message, MessageComponentInteraction, OAuth2Scopes, PermissionsBitField } from 'discord.js';
import config from '@/config';
import sendEmbed from '@/utils/sendEmbed';
import CommandLoader from '@/loaders/command';
import EventLoader from '@/loaders/event';

import type { CommandData, SendMessageOptions } from '@/types';

class Client extends DiscordClient<true> {
  commands: CommandData[] = [];

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds],
      presence: config.presence
    });
  }

  async start() {
    process.on('unhandledRejection', (error) => global.logger.error(error));
    process.on('uncaughtException', (error) => global.logger.error(error));

    this.extendPrototypes();

    await this.login(process.env.BOT_TOKEN).catch((error) => {
      global.logger.error(error);
      process.exit(1);
    });

    this.once('ready', async (client) => {
      global.logger.info(`Logged in as ${client.user.tag}`);

      await CommandLoader.loadCommands();
      await EventLoader(this);

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

  private extendPrototypes() {
    [Message, ChatInputCommandInteraction, MessageComponentInteraction].forEach((classType) => {
      Object.defineProperties(classType.prototype, {
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