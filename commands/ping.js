module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
			message.channel.send({embed: {
  		color: message.guild.me.displayColor,
			timestamp: new Date(),
			footer: {
				text: `Requested by ${message.member.displayName}`
						},
						fields: [
							{
								name: 'Discord Ping:',
								value: (new Date().getTime() - message.createdTimestamp + " ms"),
							}]

}});
	},
};
