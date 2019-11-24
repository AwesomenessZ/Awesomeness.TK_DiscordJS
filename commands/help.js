const { prefix } = require('../config.json');
module.exports = {
	name: 'help',
	description: 'List all of the commands of this bot or lists infromation about specified command.',
	aliases: ['commands','h','halp'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
    const data = [];
    const { commands } = message.client;

    if (!args.length) {
//If in dm
			if (!message.guild) {
			message.channel.send({embed: {
				color: `010003`,
				timestamp: new Date(),
				title: `Awesomeness.TK Help`,
				url: `https://awesomeenss.tk`,
				thumbnail: {
					url: 'https://cdn.discordapp.com/avatars/549328310442917921/e0712ca74407eb5ff6883642fada62a0.png?size=128',
							},
				description: `You can see help for indivudal commands by running /help (Command Name)`,
					fields: [
						{
							name: 'Commands:',
							value: (commands.map(command => command.name).join('\n')),
						},
					],

	}});
	return
	}
//If not in dm
				message.channel.send({embed: {
						color: message.guild.me.displayColor,
						timestamp: new Date(),
						title: `Awesomeness.TK Help`,
						url: `https://awesomeenss.tk`,
						thumbnail: {
							url: 'https://cdn.discordapp.com/avatars/549328310442917921/e0712ca74407eb5ff6883642fada62a0.png?size=128',
						},
						description: `You can see help for indivudal commands by running /help (Command Name)`,
						footer: {
							icon_url: message.member.avatarURL,
							text: `Requested by ${message.member.displayName}`,
						},
						fields: [
							{
								name: 'Commands:',
								value: (commands.map(command => command.name).join('\n')),
							},
						],

}});
return
}
const name = args[0].toLowerCase();
const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

if (!command) {
	return message.reply('that\'s not a valid command!');
}

data.push(`**Name:** ${command.name}`);

if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
if (command.description) data.push(`**Description:** ${command.description}`);
if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

message.channel.send(data, { split: true });

	},
};
