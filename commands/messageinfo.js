module.exports = {
	//Command Proprties
	name: 'messageinfo',
	description: 'Displays all the bot-given infromation about your message',
	//Code to be executed
	execute(message) {
		//Sends varius infromation about the message that invoked this command to be run
		message.channel.send(`Channel id:\n${message.channel}\n${message.channel.id}\nMessage ID:\n${message.id}`);
	},
};
