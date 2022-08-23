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
        const clientcmd = client.mcommands.get(command)
        if(!clientcmd) return;
        const memberperm = clientcmd.command.memberPerm.replace("Administrator", "Administrator").replace("Administrator", "Yönetici").replace("ManageChannels", "Kanalları Yönet").replace("ManageRoles", "Rolleri Yönet").replace("ManageMessages", "Mesajları Yönet").replace("ManageGuild", "Sunucuyu Yönet").replace("ModerateMembers", "Üyelere Zamanaşımı Uygula").replace("BanMembers", "Üyeleri Yasakla").replace("KickMembers", "Üyeleri At")
        const botperm = clientcmd.command.botPerm.replace("Administrator", "Yönetici").replace("ManageChannels", "Kanalları Yönet").replace("ManageRoles", "Rolleri Yönet").replace("ManageMessages", "Mesajları Yönet").replace("ManageGuild", "Sunucuyu Yönet").replace("ModerateMembers", "Üyelere Zamanaşımı Uygula").replace("BanMembers", "Üyeleri Yasakla").replace("KickMembers", "Üyeleri At")
        if (clientcmd.command.memberPerm !== "NOPERM") {
            if (!message.member.permissions.has(clientcmd.command.memberPerm)) return message.reply({ embeds: [new EmbedBuilder().setTitle("Hata").setColor(resolveColor("Red")).setDescription(`\`${memberperm}\` iznin yok.`)] })
        }
        if (clientcmd.command.botPerm !== "NOPERM") {
            if (!message.guild.members.me.permissions.has(clientcmd.command.botPerm)) return message.reply({ embeds: [new EmbedBuilder().setTitle("Hata").setColor(resolveColor("Red")).setDescription(`\`${botperm}\` iznim yok.`)] })
        }
        if(clientcmd.command.developer === true && client.config.owners.includes(message.author.id)) {return;}
        clientcmd.run({ client, message, args })
    }
}
