module.exports = {
	//Defines properties
	name: 'listdb',
	description: 'listdb',
	//code to be executed
	async execute(message) {
  if(message.author.tag != "AwesomenessZ#3945"){
      return message.channels.send("Only AwesomenessZ#3945 can run this command!")}
    const Keyv = require('keyv');
    const statusID = await new Keyv('mongodb://localhost:27017/discordbot_statusID')
    const statusCH = await new Keyv('mongodb://localhost:27017/discordbot_statusCH')
    const id = await new Keyv('mongodb://localhost:27017/discordbot_Identifers')
    var index = await id.get("index")
    message.channel.send("Index: " + index)
    for (var c = 0; c < (index.length - 1);) {
        c++//adds to c at the start because message identifiers start at postion 1 not 0
        var guildSCH = await statusCH.get(index[c])
        var guildSID = await statusID.get(index[c])
        message.channel.send(index[c] + ": \nguildSCH: " + guildSCH + "\nguildSID: " + guildSID)
    }
	},
};
