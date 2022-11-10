module.exports = {
    command: {
        name: "ping"
    },
    async run({ client, message, args }) {
        message.reply({ content: `${client.ws.ping}ms` })
    },
}
