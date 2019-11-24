module.exports = {
	name: 'apikey',
	description: 'Sets the apikey for your bedrock minecraft server! Only one apikey can be assigned per discord server to make sure only servers that the discord owner approves are shown. Grab your Api key from https://minecraftpocket-servers.com/help/api/',
	aliases: ['setminecraft','key','api'],
	guildOnly: true,
  args: true,
  usage: '<Secret Api Key>',
	execute(message, args) {
    if(!message.member.hasPermission("ADMINISTRATOR"))
      return message.reply("Sorry, you don't have permissions to use this! Only Administrators can assign an apikey!");
      const Keyv = require('keyv');
      const apikey = new Keyv('mongodb://localhost:27017/discordbot');
      var guild = message.guild.id
        apikey.set(guild, args[0])
      console.log(`api key for ${message.guild.name} has been set to ${args[0]}`)
	},
};



//https://cdn.discordapp.com/emojis/536336948005175326.gif
