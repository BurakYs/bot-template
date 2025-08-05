import { BaseInteraction, Client as DiscordClient, Events, GatewayIntentBits, OAuth2Scopes, PermissionsBitField } from 'discord.js';
import i18next, { type TFunction, type TOptions } from 'i18next';
import config from '@/config';
import CommandLoader from '@/loaders/command';
import loadEvents from '@/loaders/event';
import type { CustomMessageOptions } from '@/types';
import sendEmbed from '@/utils/sendEmbed';
import setupI18n from '@/utils/setupI18n';

class Client extends DiscordClient<true> {
    constructor() {
        super({
            intents: [GatewayIntentBits.Guilds],
            presence: config.presence
        });
    }

    async start() {
        await setupI18n();
        this.extendInteractionPrototype();

        this.once(Events.ClientReady, async (client) => {
            global.logger.info(`Logged in as ${client.user.tag}`);

            await CommandLoader.loadCommands();
            await loadEvents(this);
        });

        await this.login(process.env.BOT_TOKEN).catch((error) => {
            global.logger.error(error);
            process.exit(1);
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

    private extendInteractionPrototype() {
        Object.defineProperties(BaseInteraction.prototype, {
            error: {
                value(optionsOrMessage: string | Partial<CustomMessageOptions>) {
                    let options: Partial<CustomMessageOptions> | string = optionsOrMessage;

                    if (typeof options === 'string') {
                        options = { description: options };
                    }

                    return sendEmbed(this, { ...options, embedType: 'error' });
                }
            },
            success: {
                value(optionsOrMessage: string | Partial<CustomMessageOptions>) {
                    let options: Partial<CustomMessageOptions> | string = optionsOrMessage;

                    if (typeof options === 'string') {
                        options = { description: options };
                    }

                    return sendEmbed(this, { ...options, embedType: 'success' });
                }
            },
            translate: {
                value(...args: Parameters<TFunction>) {
                    const options: TOptions = typeof args[1] === 'object' && args[1] != null ? args[1] : {};
                    if (!options.lng) options.lng = this.language || this.locale;
                    (args[1] as unknown as TOptions) = options;

                    return i18next.t(...args);
                }
            }
        });
    }
}

const client = new Client();
export default client;
