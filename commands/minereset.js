module.exports = {
  //Defines the propties of the command
  name: "minereset",
  cooldown: 5,
  description: "Currently Resets the mines on Specifc Minecraft servers only!",
  guildOnly: true,
  aliases: ["resetmines", "mineresets", "resetmine"],
  //Code to be executed when command is invoked
  execute(message, args, displayColor) {
    //Has to be in Prison Miner Server for command to run. (Not currently modular)
    if (message.guild.id !== "445449992795062273") {
      //Stops the rest of the code from running and tells the user that this can only be run in specific guilds
      return message.channel.send({
        embed: {
          color: displayColor,
          timestamp: new Date(),
          title: `This command can only be run in Specific Guilds ATM! Sorry for the inconvenience!`,
          footer: {
            text: `Requested by <@${message.author.id}>`
          }
        }
      });
    }
    //Checking if the user has permission to run this command
    if (
      message.member.roles.some(r =>
        [
          "Dev",
          "🔰 Staff 🔰",
          "🛠️ Builder 🛠️",
          "Head Of Staff",
          "Owner",
          "MVP",
          "🛡️Staff in Training 🛡️"
        ].includes(r.name)
      )
    ) {
      //If they have one of the roles, send a curl request to a rcon api to run the command 'cmd run resetmines' on the specifed server
      const { curly } = require("node-libcurl");
      const querystring = require("querystring");
      message.channel.send({
        embed: {
          color: displayColor,
          timestamp: new Date(),
          title: `Mines will now be reset`,
          footer: {
            text: `Requested by ${message.author.username}`
          }
        }
      });
      curly.post("https://edroid.me/projects/rcon++/beta/client.php", {
        postFields: querystring.stringify({
          ip: "prisonminer.leet.cc",
          port: "56100",
          password: "WUIwT0o4",
          command: "cmd run resetmines"
        })
      });
    } else {
      //Dosent have one of the roles needed to run the command
      message.channel.send({
        embed: {
          color: displayColor,
          timestamp: new Date(),
          title: `This command can only be run by staff! Please ask a staff member to reset the mines!`,
          footer: {
            text: `Requested by ${message.author.username}`,
            icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
          }
        }
      });
    }
  }
};
