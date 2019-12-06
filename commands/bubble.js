module.exports = {
	//sets properties of the command
	name: 'bubble',
	description: 'Transforms text into art!',
	args: true,
	usage: '<message>',
	aliases: ['figlet','box','ascii'],
	//executes commands code
	execute(message, args) {
		//We are loading in the figlet api
		var figlet = require('figlet');
		const text = args.join(' ')
		//tell figlet to convert the users message into figlet form
		figlet(text, {
			//Optimal settings for figlet for compatibility with discord
			horizontalLayout: 'default',
			verticalLayout: 'default'
		}, function(err, data) {
		//Tell console if their was an error
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
		//send the converted message back to the channel it came from
		message.channel.send(`\`\`\`${data}\`\`\``)
		//Report who requested the message and at one time in that same channel
		message.channel.send({embed: {
		color: message.guild.me.displayColor,
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.member.displayName}`
			},
	}}),
	console.log() //Exists because code is expected to be here, dosent actually do anything
}
);
	},
};
