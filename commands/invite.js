module.exports = {
  //Defines properties of the command
  name: "invite",
  description:
    "Gives you the invite to add this bot to your own discord servers!",
  cooldown: 5,
  aliases: [],
  //Code to be executed
  execute(message, args, displayColor) {
    //sends the users the invite url for the bot, so that it may be added to their own servers
    message.channel.send({
      embed: {
        color: displayColor,
        timestamp: new Date(),
        title: `To invite me to your discord server click here!`,
        url: `https://discordapp.com/oauth2/authorize?client_id=549328310442917921&permissions=0&scope=bot`,
        footer: {
          //reports who requested the invite url
          text: `Requested by ${message.author.username}`,
          icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        }
      }
    });
  }
};
