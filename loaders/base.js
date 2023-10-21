const config = require("../config.js");
const { OAuth2Scopes, Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } = require("discord.js");
const chalk = require("chalk")
const Cache = require("../classes/Cache.js")

function dynamicImport(path) {
    let file = require.resolve(path)
    delete require.cache[file]
    return require(path)
}

module.exports = class extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
            ],
            scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
            partials: [Partials.Message, Partials.Channel, Partials.User]
        });
        global.client = this
        global.setLongTimeout = function (callback, delay) {
            if (delay <= 0) {
                callback()
            } else if (delay <= 2147483647) {
                setTimeout(callback, delay)
            } else {
                setTimeout(() => {
                    setLongTimeout(callback, delay - 2147483647)
                }, 2147483647)
            }
        }
        this.slashCommands = new Collection()
        this.utils = new Proxy({}, {
            get: function (target, prop) {
                return dynamicImport(`../utils/${prop}.js`);
            },
        });
        Object.defineProperty(this, 'config', {
            get: () => {
                return dynamicImport('../config.js')
            },
        });
        this.cache = new Cache()
        this.error = function error(interaction, {
            content = null,
            description,
            ephemeral = false,
            noEmbed = false,
            author = null,
            title = null,
            image = null,
            thumbnail = null,
            color = null,
            footer = null,
            operation = "reply",
        } = {}) {
            if (interaction.deferred) {
                operation = "editReply"
            }
            if (noEmbed) return interaction[operation]({
                content: `${title ? `## ${title}\n` : ""}${description}${footer ? `\n\n${typeof footer === "object" ? footer.text : footer}` : ""}`,
                allowedMentions: { parse: [] },
                ephemeral,
            })
            const randomTitle = ["Error", "Whoops!"].random()
            return interaction[operation]({
                content: content,
                embeds: [new EmbedBuilder()
                    .setAuthor(author)
                    .setThumbnail(thumbnail)
                    .setImage(image)
                    .setTitle(title || randomTitle)
                    .setColor(color || this.config.embedColors.error)
                    .setDescription(description)
                    .setFooter(footer),
                ],
                ephemeral,
                components: [],
            }).catch(() => null)

        };
        this.success = function success(interaction, {
            content = null,
            description,
            ephemeral = false,
            noEmbed = false,
            author = null,
            title = null,
            image = null,
            thumbnail = null,
            color = null,
            footer = null,
            operation = "reply",
        } = {}) {
            if (interaction.deferred) {
                operation = "editReply"
            }
            if (noEmbed) return interaction[operation]({
                content: `${title ? `## ${title}\n` : ""}${description}${footer ? `\n\n${typeof footer === "object" ? footer.text : footer}` : ""}`,
                allowedMentions: { parse: [] },
                ephemeral,
            })
            const randomTitle = ["Success", "Successful"].random()
            return interaction[operation]({
                content: content,
                embeds: [new EmbedBuilder()
                    .setAuthor(author)
                    .setThumbnail(thumbnail)
                    .setImage(image)
                    .setTitle(title || randomTitle)
                    .setColor(color || this.config.embedColors.success)
                    .setDescription(description),
                ],
                ephemeral,
                components: [],
            }).catch(() => null)
        };
        this.commands = []
        process.on("unhandledRejection", (reason) => {
            if (reason.toString().includes("DiscordAPIError")) return;
            console.log(`${chalk.red("--------------------------------------------------")}`)
            console.log(`${chalk.red("[Error Handler]: Unhandled Rejection")}`)
            console.error(reason)
            console.log(`${chalk.red("--------------------------------------------------")}`)
        })
        process.on("uncaughtException", (err) => {
            if (err.toString().includes("DiscordAPIError")) return;
            console.log(`${chalk.red("--------------------------------------------------")}`)
            console.log(`${chalk.red("[Error Handler]: Uncaught Exception")}`)
            console.error(err)
            console.log(`${chalk.red("--------------------------------------------------")}`)
        })
    }

<<<<<<< HEAD
    async loader() {
        try {
            require("../extensions/array.js")();
            require("../extensions/date.js")();
            require("../extensions/number.js")();
            require("../extensions/string.js")();
            config.project.mongo ? await require("./mongo.js")(this) : null;
            await require("./listeners.js")(this);
            require("./event.js")(this);
            await this.login(config.bot.token);
            await require("./command.js")(this);
        } catch (e) {
            console.error(e);
        }
    }
};
=======
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent
      ],

      scopes: [OAuth2Scopes.Bot, OAuth2Scopes.ApplicationsCommands],
      partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember],
    });
    global.client = this
    this.slashcmds = new Collection();
    this.messagecmds = new Collection();
    this.contextcmds = new Collection();
    this.aliases = new Collection()
    this.config = config;
    this.utils = {
      logger: require("../utils/logger.js"),
      findCommand: require("../utils/findCommand.js")
    }
    this.error = async function error(interaction, { description, ephemeral = false } = {}) {
      return await interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle("Error")
          .setColor(resolveColor("Red"))
          .setDescription(description)
        ],
        ephemeral: ephemeral,
      }
      )
    };
    this.success = async function success(interaction, { description, ephemeral = false } = {}) {
      return await interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle("Successful")
          .setColor(resolveColor("Green"))
          .setDescription(description)
        ],
        ephemeral: ephemeral,
      }
      )
    };
    this.warn = async function warn(interaction, { description, ephemeral = false } = {}) {
      return await interaction.reply({
        embeds: [new EmbedBuilder()
          .setTitle("Warn")
          .setColor(resolveColor("Gold"))
          .setDescription(description)
        ],
        ephemeral: ephemeral,
      }
      )
    };
    this.commands = [
      {
        name: 'ping',
        desc: 'Ping Pong!',
        aliases: ["pong"],
        category: 'Bot',
        reqPermMember: 'NONE',
        reqPermBot: 'NONE'
      }
    ]
    process.on("unhandledRejection", (reason) => {
      if (["DiscordAPIError[10062]: Unknown interaction", "DiscordAPIError[40060]: Interaction has already been acknowledged."].includes(reason)) return;
      console.log(`${chalk.red("--------------------------------------------------")}`)
      console.log(`${chalk.red("[Error Handler]: Unhandled Rejection")}`)
      console.error(reason)
      console.log(`${chalk.red("--------------------------------------------------")}`)
    })
    process.on("uncaughtException", (err) => {
      if (["DiscordAPIError[10062]: Unknown interaction", "DiscordAPIError[40060]: Interaction has already been acknowledged."].includes(err)) return;
      console.log(`${chalk.red("--------------------------------------------------")}`)
      console.log(`${chalk.red("[Error Handler]: Uncaught Exception")}`)
      console.error(err)
      console.log(`${chalk.red("--------------------------------------------------")}`)
    })
  }

  loader() {
    require("./definitions.js")(this)
    require("../loaders/event.js")(this);
    require("../loaders/command.js")(this);
    require("../loaders/listeners.js")(this);
    this.login(config.bot.token).catch(e => console.error(e))
  };
};
>>>>>>> 94a3c68f27bd8ae856f00c3d1bf666a54dacbde4
