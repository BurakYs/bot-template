import { ChatInputCommandInteraction, Client as DiscordClient, GatewayIntentBits, Message, MessageComponentInteraction, OAuth2Scopes, PermissionsBitField } from 'discord.js';
import config from '@/config';
import sendEmbed from '@/utils/sendEmbed';
import CommandLoader from '@/loaders/command';
import EventLoader from '@/loaders/event';
import setupI18n from '@/utils/setupI18n';
import i18next, { type TFunction, type TOptions } from 'i18next';

import type { CommandData, CustomMessageOptions } from '@/types';

class Client extends DiscordClient<true> {
  commands: CommandData[] = [];

  constructor() {
    super({
      intents: [GatewayIntentBits.Guilds],
      presence: config.presence
    });
  }

  async start() {
    await setupI18n();
    this.extendPrototypes();

    await this.login(process.env.BOT_TOKEN).catch((error) => {
      global.logger.error(error);
      process.exit(1);
    });

    this.once('ready', async (client) => {
      global.logger.info(`Logged in as ${client.user.tag}`);

      await CommandLoader.loadCommands();
      await EventLoader(this);
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

  private extendPrototypes() {
    [Message, ChatInputCommandInteraction, MessageComponentInteraction].forEach((classType) => {
      Object.defineProperties(classType.prototype, {
        error: {
          value(options: Partial<CustomMessageOptions>) {
            return sendEmbed(this, { ...options, embedType: 'error' });
          }
        },
        success: {
          value(options: Partial<CustomMessageOptions>) {
            return sendEmbed(this, { ...options, embedType: 'success' });
          }
        },
        translate: {
          value(...args: Parameters<TFunction>) {
            const options: TOptions = (typeof args[1] === 'object' && args[1] != null) ? args[1] : {};
            options.lng = this.preferences?.language || this.locale;

            return i18next.t(...args);
          }
        }
      });
    });
  }
}

const client = new Client();
export default client;