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
      data.push('Here\'s a list of all of my commands:**');
			data.push(commands.map(command => command.name).join('\n'));
			data.push(`**You can send \`${prefix}help [command name]\` to get info on a specific command!`);

return message.reply(data, { split: true })
	.then(() => {
	})
	.catch(error => {
		console.error(`Could not send help to ${message.author.tag}.\n`, error);
		message.reply('Something has gone wrong! Yay!');
	});
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
