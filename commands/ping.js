module.exports = {
	//Defines properties
	name: 'ping',
	description: 'Ping!',
	//code to be executed
	execute(message, args, displayColor) {
			//Send a rich chat message
			message.channel.send({embed: {
				color: displayColor,
				//sets the time of the request being made
				timestamp: new Date(),
				footer: {
					text: `Requested by ${message.member.displayName}`,
					icon_url:`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
				},
				fields: [
					{
						name: 'Discord Ping:',
						//Takes the current time subtracted by the time the users message was sent
						//Giving us the ping!
						value: (new Date().getTime() - message.createdTimestamp + " ms"),
					}]

}});
	},
};
