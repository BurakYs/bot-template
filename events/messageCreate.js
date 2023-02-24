const { EmbedBuilder, resolveColor } = require("discord.js");
module.exports = {
    name: 'messageCreate',
    async run(client, message) {
        const prefix = client.config.prefix
        if (message.author.bot) return;
        if (!message.content.startsWith(`${prefix}`)) return;
        const command = message.content.split(" ")[0].slice(prefix.length)
        let args = message.content.split(" ")
        args.shift()
        const clientcmd = client.messagecmds.get(command)
        if (!clientcmd) return;
        const cmd = client.commands.find(x => x.name === clientcmd.command.name)
        if (!message.guild && cmd.dm === false) return;
        const reqPermMember = cmd.reqPermMember.replace("Administrator", "Administrator").replace("ManageChannels", "ManageChannels").replace("ManageRoles", "Manage Roles").replace("ManageMessages", "Manage Messages").replace("ManageGuild", "Manage Server").replace("ModerateMembers", "Timeout Members").replace("BanMembers", "Ban Members").replace("KickMembers", "Kick Members").replace("ManageNicknames", "Manage Nicknames")
        const reqPermBot = cmd.reqPermBot.replace("Administrator", "Administrator").replace("ManageChannels", "ManageChannels").replace("ManageRoles", "Manage Roles").replace("ManageMessages", "Manage Messages").replace("ManageGuild", "Manage Server").replace("ModerateMembers", "Timeout Members").replace("BanMembers", "Ban Members").replace("KickMembers", "Kick Members").replace("ManageNicknames", "Manage Nicknames")
        if (cmd.reqPermMember !== "NONE") {
            if (!message.member.permissions.has(cmd.reqPermMember)) return message.reply({ embeds: [new EmbedBuilder().setTitle("Missing Permissions").setColor(resolveColor("Red")).setDescription(`You don't have this permission: \`${reqPermMember}\``)] })
        }
        if (cmd.reqPermBot !== "NONE") {
            if (!message.guild.members.me.permissions.has(cmd.reqPermBot)) return message.reply({ embeds: [new EmbedBuilder().setTitle("Missing Permissions").setColor(resolveColor("Red")).setDescription(`I don't have this permission: \`${reqPermBot}\``)] })
        }
        try {
            clientcmd.run({ client, message, args, prefix })
        } catch (error) {
            return console.log(error)

        }
    }
}
