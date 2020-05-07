module.exports = {
	name: 'jointime',
	description: 'Tells you the exact time the user joined discord!',
  usage: '<User>',
  aliases: ['join','when'],
	execute(message, args) {
    if (!args.length) {
        const msg = [];
      msg.push("You joined discord on:")
				const date = new Date(message.member.id);
        msg.push(date)
          message.reply((msg).join(" "))
      		return message.channel.send()
        .then(() => {
          })
          .catch(error => {
            });
        };
    if (args.length) {
        let member = message.mentions.members.first() || message.guild.members.get(args[0]);
								const date = new Date(member.id);
        message.channel.send(`${member} joined discord on:\n${date}`)
            message.channel.send((msg).join(" "))};
	},
};
