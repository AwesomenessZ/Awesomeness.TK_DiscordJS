module.exports = {
  //Defines command properties
  name: "speedyboi",
  description: "Sends an image of a Speedy Boi!",
  cooldown: 5,
  aliases: ["speed", "sped"],
  guildOnly: false,
  //code to execute
  execute(message, args, displayColor) {
    //sends a gif inside an embed
    message.reply({
      embeds: {
        color: displayColor,
        timestamp: new Date(),
        footer: {
          text:
            `Requested by ${message.author.username} • ` +
            (new Date().getTime() - message.createdTimestamp) +
            " ms",
          icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        image: {
          url: `https://cdn.discordapp.com/emojis/536336948005175326.gif`
        }
      }
    });
  }
};

//https://cdn.discordapp.com/emojis/536336948005175326.gif
