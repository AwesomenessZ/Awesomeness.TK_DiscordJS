module.exports = {
	//Defines command properties
	name: 'speedyboi',
	description: 'Sends an image of a Speedy Boi!',
	cooldown: 5,
	aliases: ['speed','sped'],
	guildOnly: true,
	//code to execute
	execute(message) {
		//sends a gif inside an embed
		message.channel.send({embed: {
			color: message.guild.me.displayColor,
			timestamp: new Date(),
			footer: {
				text: `Requested by ${message.member.displayName}`,
				icon_url:`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
						},
			image: {
					url:`https://cdn.discordapp.com/emojis/536336948005175326.gif`
							}

}});
	},
};



//https://cdn.discordapp.com/emojis/536336948005175326.gif
