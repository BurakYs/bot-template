module.exports = {
    command: {
        name: "ping",
        desc: "Ping Pong",
        category: "Bot",
        memberPerm: "NOPERM",
        botPerm: "NOPERM",
        developer: false
    },
    async run({ client, message, args }) {
        message.reply({ content: `${client.ws.ping}ms` })
    },
}
