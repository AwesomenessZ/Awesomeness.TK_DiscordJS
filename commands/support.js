module.exports = {
  //Defines properties of the command
  name: "support",
  description: "Sends the bot support server's invite link!",
  cooldown: 5,
  //Code to be executed
  execute(message, args, displayColor) {
    //sends the users the invite url for the bot, so that it may be added to their own servers
    message.channel.send({
      embed: {
        color: displayColor,
        timestamp: new Date(),
        title: `Click here to join the support server!`,
        url: `https://discord.gg/y6wu7P8NfC`,
        footer: {
          //reports who requested the invite url
          text:
            `Requested by ${message.author.username} • ` +
            (new Date().getTime() - message.createdTimestamp) +
            " ms",
          icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
        },
      },
    });
  },
};
