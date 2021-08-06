module.exports = {
  //Configuration of the command
  name: "dancingboi",
  description: "Sends an image of a Speedy Boi!",
  cooldown: 5,
  aliases: ["dancing", "boi"],
  guildOnly: false,
  //executing the commands code
  execute(message, args, displayColor) {
    //sends a gif withen an embeded (Rich text) message
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
          url: `https://media.discordapp.net/attachments/605187392080576533/607051457723891733/image0-2.gif`
        }
      }
    });
  }
};
