module.exports = {
	//Defines the command Properties
	name: 'off',
	description: 'Turns Stuff Off!',
	//code to run
	execute(message) {
		//Thanks the executer for saving power
		message.channel.send('Thank you for saving power! Feel good about yourself! :smile:');
		//Actually stops the bot from typing if gliched out
		message.channel.stopTyping(true)
	},
};
