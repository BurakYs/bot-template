const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Modal, TextInputBuilder, InteractionType, resolveColor} = require("discord.js");
module.exports = async (client) => {

  client.on('ready', () => {    
        var actvs = [
          `/yardım ${client.guilds.cache.size} sunucuyu`,
          `/yardım ${client.users.cache.size} Kullanıcıyı`, 
          `/yardım`
      ];
      client.user.setPresence({ activities: [{ name: actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)] }], type: 'LISTENING' });
      setInterval(() => {
        client.user.setPresence({ activities: [{ name: actvs[Math.floor(Math.random() * (actvs.length - 1) + 1)] }], type: 'LISTENING' });
      }, 15000);
      
    
        console.log ('_________________________________________');
        console.log (`Kullanıcı İsmi     : ${client.user.username}`);
        console.log (`Sunucular          : ${client.guilds.cache.size}`);
        console.log (`Kullanıcılar       : ${client.users.cache.size}`);
        console.log (`Durum              : Bot Çevrimiçi!`);
        console.log ('_________________________________________');
      
      });
      client.on("messageCreate", message => {
        if(message.channel.id === "997949083253751938" && message.author.bot && message.embeds) {
          if(message.author.id === client.user.id) return;
          client.channels.cache.get("981504799214276608").send({content: "<@&981899104881885266>", embeds: [new MessageEmbed().setImage(message.embeds[0].image.url).setColor("#00FF00")]})
        }
      })
      client.on("messageCreate", message => {
        if(message.channel.id !== "998547729821220954") return;
        if(["678993693088415764", "799299809705459813", "972555911241556048"].includes(message.author.id)) return;
        if(message.author.id === client.user.id) return;
    
        client.channels.cache.get("981504521484242964").send({content: `${message.content}`})
          message.attachments.forEach(x => client.channels.cache.get("981504521484242964").send({files: [x.url]}).catch(e => client.channels.cache.get("981504521484242964").send({content: "Bir fotoğraf yüklenemedi."})))
    
      })
}