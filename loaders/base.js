const config = require("./../config.js");
const { OAuth2Scopes, Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
module.exports = class extends Client {

  constructor() {
    super({

      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ],

      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember, Partials.ThreadMember, Partials.GuildScheduledEvent],

      ws: {
        version: "10"
      }
    });
    this.config = config;
    this.slashcmds = new Collection();
    this.messagecmds = new Collection();
    this.contextcmds = new Collection()
    global.client = this
    this.commands = [
      {
        name: 'ping',
        desc: 'Ping Pong',
        category: 'Bot',
        reqPermMember: 'NONE',
        reqPermBot: 'NONE',
        cooldown: 5000
      }
    ]
    process.on("unhandledRejection", (reason, promise) => { console.log(reason, promise) })
    process.on("uncaughtException", (err) => { if (err === "DiscordAPIError[10062]: Unknown interaction" || err === "DiscordAPIError[40060]: Interaction has already been acknowledged.") return; console.log(err) })
    process.on("uncaughtExceptionMonitor", (err) => { if (err === "DiscordAPIError[10062]: Unknown interaction" || err === "DiscordAPIError[40060]: Interaction has already been acknowledged.") return; console.log(err) })
  }

  loader() {
    require("../handlers/eventHandler.js")(this);
    require("../loaders/command.js")(this);
    require("../loaders/listeners.js")(this);
    this.login(config.token).catch(e => console.log(e))
  };
};
