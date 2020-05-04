module.exports = {
	//Defines properties
	name: 'emojiletters',
	description: 'Send your message but in emojis!',
  args: true,
  aliases: ['emoji','emojify'],
  usage: '<message>',
	//code to be executed
	execute(message, args, displayColor) {
    var msg = args.join(" ")
    var og = msg
    msg = msg.toLowerCase()
    msg = msg.split("")
    var i
    for (i = 0; i < msg.length; i++) {
      if(msg[i].match(/[a-z]/i)){
      msg[i] = ":regional_indicator_" + msg[i] + ":"
    }}
    msg = msg.join("")
    message.channel.send({embed: {
      color: displayColor,
      timestamp: new Date(),
      footer: {
        text: `Requested by ${message.author.username}`,
        icon_url:`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
      },
      fields: [
        {
          name: 'Original Message:',
          value: og,
        },
        {
          name: 'Converted Message:',
          value: msg,
        },
      ]
}});
	},
};
