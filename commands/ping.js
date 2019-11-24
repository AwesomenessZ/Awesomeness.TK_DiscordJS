module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
		message.channel.send(new Date().getTime() - message.createdTimestamp + " ms");
	},
};
