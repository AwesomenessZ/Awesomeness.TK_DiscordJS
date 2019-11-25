module.exports = {
	name: 'bubble',
	description: 'Transforms text into art!',
	args: true,
	usage: '<message>',
	aliases: ['figlet','box','ascii'],
	execute(message, args) {
		var figlet = require('figlet');
		const text = args.join(' ')
figlet(text, {
    horizontalLayout: 'default',
    verticalLayout: 'default'
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
		message.channel.send(`\`\`\`${data}\`\`\``)
		message.channel.send({embed: {
		color: message.guild.me.displayColor,
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.member.displayName}`
			},
	}}),
console.log(data)
//message.channel.send({embed: {
//	color: message.guild.me.displayColor,
//	timestamp: new Date(),
//	footer: {
//		text: `Requested by ${message.member.displayName}`
//				},
//	fields: [{
//		name: `${text}`,
//		value: `\`\`\`${data}\`\`\``
//	}
//],

}
);
	},
};
