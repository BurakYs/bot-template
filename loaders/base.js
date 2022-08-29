const config = require('./../config.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Modal, TextInputBuilder, OAuth2Scopes, partials, resolveColor, Client, Collection, GatewayIntentBits } = require("discord.js");

module.exports = class extends Client {

  constructor() {
    super({

      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.MessageContent
      ],

      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.ThreadMember, Partials.GuildScheduledEvent],

      ws: {
        version: "10"
      }
    });
    this.config = config;
    this.commands = new Collection();
    this.mcommands = new Collection();
    global.client = this
    process.on("unhandledRejection", (reason, promise) => { console.log(reason, promise) })
    process.on("uncaughtException", (err) => { console.log(err) })
    process.on("uncaughtExceptionMonitor", (err) => { console.log(err) })
  }

  loader() {

    require('../handlers/eventHandler.js')(this);
    require('../loaders/command.js')(this);
    require("../loaders/listeners.js")(this);
    require("../loaders/messagecommand.js")(this);
    this.login(config.token).catch(e => console.log(e))
  };
};
