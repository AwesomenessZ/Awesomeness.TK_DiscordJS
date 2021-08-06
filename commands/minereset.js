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
      return message.reply({
        embeds: {
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
      message.member.roles.cache.some(r =>
        [
          "Dev",
          "Staff",
          "Builder",
          "Head Of Staff",
          "Owner",
          "MVP",
          "Staff in Training️"
        ].includes(r.name)
      )
    ) {
      //If they have one of the roles, send a curl request to a rcon api to run the command 'cmd run resetmines' on the specifed server
      message.reply({
        embeds: {
          color: displayColor,
          timestamp: new Date(),
          title: `Mines will now be reset`,
          footer: {
            text:
              `Requested by ${message.author.username} • ` +
              (new Date().getTime() - message.createdTimestamp) +
              " ms"
          }
        }
      });

      const Rcon = require("modern-rcon");
      const rcon = new Rcon("prisonminer.leet.cc", (port = 56100), "8ZYONF6");
      rcon
        .connect()
        .then(() => {
          return rcon.send("cmd run resetmines"); // That's a command for Minecraft
        })
        .then(res => {
          console.log(res);
        })
        .then(() => {
          return rcon.disconnect();
        });
    } else {
      //Dosent have one of the roles needed to run the command
      message.reply({
        embeds: {
          color: displayColor,
          timestamp: new Date(),
          title: `This command can only be run by staff! Please ask a staff member to reset the mines!`,
          footer: {
            text:
              `Requested by ${message.author.username} • ` +
              (new Date().getTime() - message.createdTimestamp) +
              " ms",
            icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
          }
        }
      });
    }
  }
};
