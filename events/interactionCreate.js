
    const { ActionRowBuilder, TextInputBuilder, InteractionType, EmbedBuilder, resolveColor, Embed} = require("discord.js");
    module.exports = {
        name: 'interactionCreate',
        async run(client, interaction) {
            if (!interaction.type === InteractionType.ApplicationCommand) return;

            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            if (client.commands.get(interaction.commandName).command.reqPermMember !== "NONE") {
                const reqPermMember = client.commands.get(interaction.commandName).command.reqPermMember.replace("Administrator", "Yönetici").replace("ManageChannels", "Kanalları Yönet").replace("ManageRoles", "Rolleri Yönet").replace("ManageMessages", "Mesajları Yönet").replace("ManageGuild", "Sunucuyu Yönet").replace("ModerateMembers", "Üyelere Zamanaşımı Uygula").replace("BanMembers", "Üyeleri Yasakla").replace("KickMembers", "Üyeleri At")
                if (!interaction.member.permissions.has(client.commands.get(interaction.commandName).command.reqPermMember) && !client.config.owners.includes(interaction.user.id)) return interaction.reply({
                    embeds: [new EmbedBuilder().setTitle("Hata").setColor("Red").setDescription(`\`${reqPermMember}\` iznin yok.`)]
                })
            }
            if (client.commands.get(interaction.commandName).command.reqPermBot !== "NONE") {
                const reqPermBot = client.commands.get(interaction.commandName).command.reqPermBot.replace("Administrator", "Yönetici").replace("ManageChannels", "Kanalları Yönet").replace("ManageRoles", "Rolleri Yönet").replace("ManageMessages", "Mesajları Yönet").replace("ManageGuild", "Sunucuyu Yönet").replace("ModerateMembers", "Üyelere Zamanaşımı Uygula").replace("BanMembers", "Üyeleri Yasakla").replace("KickMembers", "Üyeleri At")
                if (!interaction.guild.members.me.permissions.has(client.commands.get(interaction.commandName).command.reqPermBot)) return interaction.reply({
                    embeds: [new EmbedBuilder().setTitle("Hata").setColor("Red").setDescription(`\`${reqPermBot}\` iznim yok.`)]
                })
            }


            try {
                await command.run(interaction)
            } catch (error) {
                if (error) {
                console.log(error)
            }
        }
        },
    };