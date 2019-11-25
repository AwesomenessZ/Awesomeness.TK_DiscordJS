module.exports = {
	name: 'dancingboi',
	description: 'Sends an image of a Speedy Boi!',
	cooldown: 5,
	aliases: ['dancing','boi'],
	guildOnly: true,
	execute(message) {
		message.channel.send({embed: {
			color: message.guild.me.displayColor,
			timestamp: new Date(),
			footer: {
				text: `Requested by ${message.member.displayName}`
						},
			image: {
					url:`https://media.discordapp.net/attachments/605187392080576533/607051457723891733/image0-2.gif`
							}

}});
	},
};
//https://media.discordapp.net/attachments/605187392080576533/607051457723891733/image0-2.gif
