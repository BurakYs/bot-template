const { resolveColor } = require("discord.js")
module.exports = {
    project: {
        redeployCommands: true, // Making this true will redeploy the slash commands
        mongo: "" // MongoDB connection uri, you can leave this empty
    },
    bot: {
        admins: [], // Bot admins who can use owner commands, first ID is the owner
        token: "",
        invite: "" // Bot invite URL
    },
    presence: {
        activity: "",
        status: "", // Status of the bot (online, idle, dnd, invisible)
    },
    guilds: {
        test: {
            id: "" // Test guild id, where you can use all commands and where owner commands will be
        },
        supportServer: {
            id: "",
            invite: ""
        },
    },
    roles: {
        errorPings: "" // Error ping role, which is on the test server to receive pings when there is an error
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