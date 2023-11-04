const { resolveColor } = require("discord.js")
module.exports = {
    project: {
        redeployCommands: true,
        mongo: "" // MongoDB connection uri, you can leave this empty
    },
    bot: {
        admins: [], // Bot admins who can use owner commands, first ID is the owner
        token: "",
        invite: ""
    },
    presence: {
        activity: "https://github.com/BurakYs/bot-template",
        status: "online",
    },
    guilds: {
        test: "",
        supportServer: {
            id: "",
            invite: ""
        },
    },
    roles: {
        errorPings: ""
    },
    channels: {
        errorLog: ""
    },
    embedColors: {
        default: resolveColor("#5865F2"),
        error: resolveColor("#DE2B0B"),
        success: resolveColor("#56B849")
    },
}