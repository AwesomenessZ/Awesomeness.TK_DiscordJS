module.exports = {
	//Defines properties
	name: 'ping',
	description: 'Ping!',
	//code to be executed
	execute(message) {
			//Send a rich chat message
			message.channel.send({embed: {
				color: message.guild.me.displayColor,
				//sets the time of the request being made
				timestamp: new Date(),
				footer: {
					text: `Requested by ${message.member.displayName}`
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
