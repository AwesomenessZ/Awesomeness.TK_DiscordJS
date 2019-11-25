module.exports = {
	name: 'updateinfo',
	description: 'Forces an update of your status message',
	guildOnly: true,
	async execute(message, args) {
    const Keyv = require('keyv');
    const apikey = new Keyv('mongodb://localhost:27017/discordbot');
    const statusID = new Keyv('mongodb://localhost:27017/discordbot')
    const statusCH = new Keyv('mongodb://localhost:27017/discordbot')
		message.channel.startTyping();
    var guild = message.guild.id
    var guildapi = await apikey.get(guild)
    var guildSID = await statusID.get(guild)
    var guildSCH = await statusCH.get(guild)
  if (!(guildapi)) {
      message.channel.send(`An api key hasn\'t been provided for this discord server! (${message.guild.name})\nAdd it with /apikey <key>`)
      message.channel.stopTyping(true)
  };
  if (!(guildSID)) {
      message.channel.send(`A status message hasnt been defined for this server! See /help setstatus for more details!`)
      message.channel.stopTyping(true)
  };
  if ((guildapi)) {
      if ((guildSID)) {
    const curl = new (require( 'curl-request' ))();
curl.setHeaders([
    'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
])
.get(`https://minecraftpocket-servers.com/api/?object=servers&element=detail&key=${guildapi}`)
.then(({body}) => {
    const json = (body)
    const jsn = JSON.parse(json)
    client.channels.get(guildSCH)
    channel.fetchMessage(guildSID)
    message.edit({embed: {
			color: message.guild.me.displayColor,
			timestamp: new Date(),
      title: `${jsn.name}'s status:`,
						},
            image: {
							url:`https://minecraftpocket-servers.com/server/${jsn.id}/banner-${jsn.id}.gif`
              },
        fields: [
					{
						name: 'Online players:',
						value: `**__${jsn.players}/${jsn.maxplayers}__**`,
					},
					{
						name: 'Ranking:',
						value: `With ${jsn.votes} votes it currently ranks #${jsn.rank}. Vote on [this website!](${jsn.url}vote)`,
					}
				],

});
		message.channel.stopTyping(true)
	})
	.catch((e) => {
		console.log(e);
	});
}
}
	},
};
