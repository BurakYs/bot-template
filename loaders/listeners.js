const {
    Events,
    ActivityType,
} = require("discord.js");
const { default: axios } = require("axios");
axios.interceptors.response.use(response => {
    return response?.data;
}, error => {
    return error.response?.data;
});

module.exports = async (client) => {
    client.once(Events.ClientReady, async () => {
        client.utils.logger.success(`Logged in as ${client.user.tag}`)
        const { activity, status } = client.config.presence
        const activityName = activity.replaceAll("{u}", client.guilds.cache.reduce((a, g) => a + (!["110373943822540800"].includes(g.id) ? g.memberCount : 0), 0).toLocaleString()).replaceAll("{s}", client.guilds.cache.size)
        await client.user.setPresence({
            activities: [{
                name: activityName, type: ActivityType.Custom, state: activityName,
            }],
            status: status,
        })

        setInterval(async () => {
            const activityName2 = activity.replaceAll("{u}", client.guilds.cache.reduce((a, g) => a + (!["110373943822540800"].includes(g.id) ? g.memberCount : 0), 0).toLocaleString()).replaceAll("{s}", client.guilds.cache.size)
            await client.user.setPresence({
                activities: [{
                    name: activityName2, type: ActivityType.Custom, state: activityName2,
                }],
                status: status,
            })
        }, 60000)
    })
}