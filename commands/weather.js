module.exports = {
  //Defines properties
  name: "weather",
  description: "Whats the weather?",
  usage:
    "request (3 letter id from https://www.weather.gov/ EX: okx (New York City))",
  guildOnly: true,
  aliases: ["w", "wa"],
  //code to be executed
  async execute(message, args, displayColor, client) {
    const Keyv = require("keyv");
    const db = new Keyv("sqlite://commands/db/weather.db");
    switch (args[0]) {
      case "set":
        var temp = args[1].toLowerCase();
        var char = /[a-z][a-z][a-z]/g;
        if (temp.match(char)) {
          temp = temp.toUpperCase();
          var loadchannel = client.channels.get("627880075140005908");
          loadchannel.send({
            embed: {
              color: displayColor,
              timestamp: new Date(),
              title: `New Server Requesting weather: ${message.guild.name}, ${args[1]}`,
              footer: {
                text: `Requested by ${message.author.username}`,
                icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
              },
              image: { url: message.guild.iconURL }
            }
          });

          var guild = message.guild.id;
          await db.set(guild, temp);

          message.channel.send({
            embed: {
              color: displayColor,
              timestamp: new Date(),
              title: `New Server weatherset for ${message.guild.name}, ${args[1]}`,
              footer: {
                text: `Requested by ${message.author.username}`,
                icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
              },
              thumbnail: { url: message.guild.iconURL },
              image: {
                url: `https://radar.weather.gov/lite/N0R/${temp}_loop.gif`
              }
            }
          });
        } else {
          message.channel.send(
            "Invalid region code! Must be 3 letter code from https://www.weather.gov/ !"
          );
        }
        break;
      default:
        var region = await db.get(message.guild.id);
        if (region) {
          message.channel.send({
            embed: {
              color: displayColor,
              timestamp: new Date(),
              title: `Radar For ${region}:`,
              footer: {
                text: `Requested by ${message.author.username}`,
                icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
              },
              image: {
                url: `https://radar.weather.gov/lite/N0R/${region}_loop.gif`
              }
            }
          });
        } else {
          message.channel.send(
            "No Region has been set for this server! To set a region do /weather set (region code) . Region codes can be found here: https://www.weather.gov/"
          );
        }
        break;
    }
  }
};

//Asheville
//https://radar.weather.gov/lite/N0R/GSP_loop.gif
