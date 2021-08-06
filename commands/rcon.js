module.exports = {
  //Defines properties
  name: "rcon",
  description:
    "Stores the minecraft server rcon data so the bot can run commands on your behalf (ex. whitelist)!",
  cooldown: 5,
  //code to be executed
  execute(message, args, displayColor) {
    switch (args[0]) {
      case "set":
        setrcon(message, args);
        break;
      default:
        message.reply({
          embeds: {
            color: displayColor,
            timestamp: new Date(),
            footer: {
              text:
                `Requested by ${message.author.username} • ` +
                (new Date().getTime() - message.createdTimestamp) +
                " ms",
              icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
            },
            fields: [
              {
                name: "Rcon Help:",
                value:
                  "***Do not run this command in a public channel!*** Your rcon infromation is sensitive and you do not want anyone to have a chance of seeing it! \n **rcon set** (ip/domain ex: masterminer.tk) (port) (password)"
              }
            ]
          }
        });
        break;
    }
  }
};

async function setrcon(message, args) {
  if (!message.member.hasPermission("MANAGE_GUILD")) {
    return message.reply(
      'Only users with the permission "Manage Server" are allowed to run this command!'
    );
  }
  const Keyv = require("keyv");
  //Loads the needed database
  const rcondb = new Keyv("sqlite://commands/db/rcon.db", {
    namespace: message.guild.id
  });
  //Start typing so that the user knows the bot is working
  var guildrconcreds = await rcondb.get("creds");
  if (!guildrconcreds) {
    guildrconcreds = [];
  }
  var ip = args[1];
  var port = parseFloat(args[2]);
  var pass = args[3];
  guildrconcreds = [ip, port, pass];
  //Attempt to connect to the server
  var failed = false;
  const Rcon = require("modern-rcon");
  const rcon = new Rcon(
    guildrconcreds[0],
    (port = guildrconcreds[1]),
    guildrconcreds[2]
  );
  await rcon
    .connect()
    .then(() => {
      return rcon.send("list"); // That's a command for Minecraft
    })
    .catch(e => {
      console.log(e);
      failed = true;
      return message.reply("Failed to connect to server!");
    })
    .then(() => {
      rcon.disconnect();
    });
  if (failed == false) {
    message.reply("Connected successfully! Don't forget to delete your password from chat!");
    rcondb.set("creds", guildrconcreds);
  }
}
