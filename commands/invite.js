module.exports = {
	name: 'invite',
	description: 'Gives you the invite to add this bot to your own discord servers!',
	cooldown: 5,
	aliases: [],
	execute(message) {
		message.channel.send({embed: {
			color: message.guild.me.displayColor,
			timestamp: new Date(),
      title:`To invite me to your discord server click here!`,
      url:`https://discordapp.com/oauth2/authorize?client_id=549328310442917921&permissions=0&scope=bot`,
			footer: {
				text: `Requested by ${message.member.displayName}`
						}

}});
	},
};
