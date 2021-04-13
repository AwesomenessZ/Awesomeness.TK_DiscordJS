module.exports = {
  //Defines properties
  name: "removestatus",
  description: "Removes the status message from the specified channel",
  guildOnly: true,
  args: true,
  aliases: ["rmstatus"],
  usage: "<channel id>",
  //code to be executed
  async execute(message, args) {
    //Test if they have permission to run this command
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.reply(
        "Sorry, you don't have permissions to use this! Only Administrators can assign an apikey!"
      );
    }
    if (!message.guild.channels.cache.has(args[0])) {
      // Testing if the channel exists within this server
      return message.reply("This channel could not be found in this guild!");
    }
    var guild = message.guild.id;
    remove(message, guild, args);
  }
};

async function remove(message, guild, args) {
  const Keyv = require("keyv");
  const statusCH = new Keyv("sqlite://commands/db/discordbot_statusCH.db");
  const id = new Keyv("sqlite://commands/db/discordbot_Identifers.db");
  var index = await id.get("index");
  if (!index) {
    index = [];
  }
  var guildSCH;
  var identifier;
  for (var c = 0; c < index.length - 1; ) {
    c++;
    guildSCH = await statusCH.get(index[c]);
    if (guildSCH == args[0]) {
      identifier = c;
    }
  }
  if (!identifier) {
    return message.channel.send(
      "Could not find a status message for that channel!"
    );
  }

  const valueToRemove = index[identifier];
  const filteredItems = index.filter(item => item !== valueToRemove);
  await id.set("index", filteredItems);
  message.channel
    .send("Removed! You can now delete the previous message if you want!")
    .catch(e => {
      //Log any errors that accors to console
      console.log(e);
    });
}
