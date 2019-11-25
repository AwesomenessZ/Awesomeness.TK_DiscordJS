module.exports = {
	name: 'messageinfo',
	description: 'Displays all the bot-given infromation about your message',
	execute(message) {
		message.channel.send(`Channel id:\n${message.channel}\n${message.channel.id}\nMessage ID:\n${message.id}`);
	},
};
