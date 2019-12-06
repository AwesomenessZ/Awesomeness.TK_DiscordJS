module.exports = {
	//Defines properties of the command
	name: 'online',
	aliases: ['who','server','on'],
	description: 'Check statistics for your minecraft bedrock server (Will only update every 3 minutes)',
	guildOnly: true,
	//Code to be run Asyncrously when command is invoked
	async execute(message) {
		//Loads the needed database
    const Keyv = require('keyv');
    const apikey = new Keyv('mongodb://localhost:27017/discordbot');
		//Start typing so that the user knows the bot is working
		message.channel.startTyping();
		//Find what server we are in so that we can load the correct config
    var guild = message.guild.id
    var guildapi = await apikey.get(guild)
	//If the guild config hasnt been set up yet, tell them how to do so
  if (!(guildapi)) {
      message.channel.send(`An api key hasn't been provided for this discord server! (${message.guild.name})\nAdd it with /apikey <key>`)
			//Stop typing so that we dont have an infnitly typing bot
			message.channel.stopTyping(true)
  }
	//If their is a server config set
  if ((guildapi)) {
		//Setup our curl request to the api
    const curl = new (require( 'curl-request' ))();
		curl.setHeaders([
    'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
		])
			//Requesting a speicifc url based on the config
			//This will return with json that we can use for displaying infromation
			.get(`https://minecraftpocket-servers.com/api/?object=servers&element=detail&key=${guildapi}`)
			.then(({body}) => {
				//Convert the result to somthing more useable
				const json = (body)
				const jsn = JSON.parse(json)
				//send a Rich chat message based on the received infromation
				message.channel.send({embed: {
					color: message.guild.me.displayColor,
					timestamp: new Date(),
					title: `${jsn.name}'s status:`,
					footer: {
						//Shows the name of the server in which infromation is being gathered
						text: `Requested by ${message.member.displayName}`,
						icon_url: message.member.avatarURL
						},
						image: {
							//Grabs the server banner
							url:`https://minecraftpocket-servers.com/server/${jsn.id}/banner-${jsn.id}.gif`
              },
					fields: [
					{
						//Displays the number of players currently online according to the api
						name: 'Online players:',
						value: `**__${jsn.players}/${jsn.maxplayers}__**`,
					},
					{
						//Showing the current rankings of the server acording to the api
						name: 'Ranking:',
						value: `With ${jsn.votes} votes it currently ranks #${jsn.rank}. Vote on [this website!](${jsn.url}vote)`,
					}
				],

}});
		//Stops typing so that the bot indicates that it is done executing
		message.channel.stopTyping(true)
	})
	.catch((e) => {
		//Log any errors that accors to console
		console.log(e);
	});
}
	},
};
