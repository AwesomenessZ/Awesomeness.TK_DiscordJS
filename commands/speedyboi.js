module.exports = {
	name: 'speedyboi',
	description: 'Sends an image of a Speedy Boi!',
	cooldown: 5,
	aliases: ['speed','sped'],
	guildOnly: true,
	execute(message) {
		message.channel.send({embed: {
			color: message.guild.me.displayColor,
			timestamp: new Date(),
			footer: {
				text: `Requested by ${message.member.displayName}`
						},
			image: {
					url:`https://cdn.discordapp.com/emojis/536336948005175326.gif`
							}

}});
	},
};



//https://cdn.discordapp.com/emojis/536336948005175326.gif
