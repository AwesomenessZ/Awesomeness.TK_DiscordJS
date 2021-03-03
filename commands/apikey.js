module.exports = {
  //Defines properties of the command
  name: "apikey",
  description:
    "Sets the apikey for your bedrock minecraft server! Only one apikey can be assigned per discord server to make sure only servers that the discord owner approves are shown. Grab your Api key from https://minecraftpocket-servers.com/servers/manage/",
  aliases: ["setminecraft", "key", "api"],
  guildOnly: true,
  args: true,
  usage: "<Secret Api Key>",
  //executing the commands code
  execute(message, args) {
    //Checks if the user has permission to set a server wide setting
    if (!message.member.hasPermission("ADMINISTRATOR"))
      //If they dont tell them
      return message.reply(
        "Sorry, you don't have permissions to use this! Only Administrators can assign an apikey!"
      );
    //Load the settings from database
    const Keyv = require("keyv");
    const apikey = new Keyv("sqlite://commands/db/apikeys.db");
    //save the server id so we know where to apply these settings to
    var guild = message.guild.id;
    //Save settings to database
    apikey.set(guild, args[0]);
    message.reply("Apikey set!");
  }
};
