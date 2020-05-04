//Loads the bots prefix from our config file
const { prefix } = require('../config.json');
module.exports = {
	//Defines properties of the command
	name: 'help',
	description: 'List all of the commands of this bot or lists infromation about the specified command.',
	aliases: ['commands','h','halp'],
	usage: '[command name]',
	cooldown: 5,
	//Code to execute
	execute(message, args, displayColor) {
    const data = [];
		//Grabs the list of commands avalible
    const { commands } = message.client;
		//Executed if no args are provided
		//Lists the commands that are avalible
    if (!args.length) {
				//Sends an embeded message
				message.channel.send({embed: {
						color: displayColor,
						timestamp: new Date(),
						title: `Awesomeness.TK Help`,
						url: `https://awesomeenss.tk`,
						thumbnail: {
							url: 'https://cdn.discordapp.com/avatars/549328310442917921/e0712ca74407eb5ff6883642fada62a0.png?size=128',
						},
						description: `You can see help for indivudal commands by running /help (Command Name)`,
						footer: {
							icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`,
							//Tells who requested the message to be sent
							text: `Requested by ${message.author.username}`,
						},
						fields: [
							{
								//Listing each individual command that is currently active on a new line
								name: 'Commands:',
								value: (commands.map(command => command.name).join('\n')),
							},
						],

}});
//If we ran the previous if statement we dont want to execute the rest
return
}
	//converts the given command name to lowercase so we don't have to worry about capitilization
	const name = args[0].toLowerCase();
	//Look for the command and grab properties of that command
	const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
	//If the command dosent exist
	if (!command) {
		//Return is used so we dont execute the rest of the code
		return message.reply('that\'s not a valid command!');
	}
	//Setup the message we are going to send with the data variable
	data.push(`**Name:** ${command.name}`);
	//Adding infromation about the command if defined
	if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
	if (command.description) data.push(`**Description:** ${command.description}`);
	if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
	//sending the gathered infromation to the user
	message.channel.send(data, { split: true });

	},
};
