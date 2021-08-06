module.exports = {
  //Defines properties
  name: "emojiletters",
  description: "Send your message but in emojis!",
  args: true,
  aliases: ["emoji", "emojify", "regional", "emojitext"],
  usage: "<message>",
  //code to be executed
  execute(message, args, displayColor) {
    var msg = args.join(" ");
    msg = msg.toLowerCase();
    msg = msg.split("");
    var i;
    for (i = 0; i < msg.length; i++) {
      if (msg[i].match(/[a-z]/i)) {
        msg[i] = ":regional_indicator_" + msg[i] + ":";
      }
    }
    msg = msg.join("");
    message.channel.send({
      content: msg,
      embeds: {
        color: displayColor,
        timestamp: new Date(),
        footer: {
          text:
            `Requested by ${message.author.username} • ` +
            (new Date().getTime() - message.createdTimestamp) +
            " ms",
          icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        }
      }
    });
  }
};
