module.exports = {
	//Command Proprties
	name: 'messageinfo',
	description: 'Displays all the bot-given infromation about your message',
	//Code to be executed
	execute(message) {
		//Sends varius infromation about the message that invoked this command to be run
		message.channel.send(`Channel id:\n${message.channel}\n${message.channel.id}\nMessage ID:\n${message.id}\nMessage.user.avatar: \nhttps://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png \nMessage Content:\n${message.content.split(" ")} \n Message.Author: \n ${message.author}`);
	},
};
