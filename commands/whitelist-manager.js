module.exports = {
  //Defines properties
  name: "minecraft-whitelist",
  description:
    "Allows you to allow certain discord roles to add themselves to your minecraft server whitelist!",
  cooldown: 5,
  aliases: ["whitelist", "whitelist-manager"],
  usage: "help",
  guildOnly: true,
  //code to be executed
  async execute(message, args, displayColor) {
    const Keyv = require("keyv");
    //Loads the needed database
    const rcondb = new Keyv("sqlite://commands/db/rcon.db", {
      namespace: message.guild.id
    });
    //Start typing so that the user knows the bot is working
    //Find what server we are in so that we can load the correct config
    if (args[1] != "help") {
      message.channel.startTyping();
      try {
        var guildrcon = [];
        var guildrconcreds = await rcondb.get("creds");
        var guildrconwhitelistmods = await rcondb.get("whitelist-mods");
        var guildrconwhitelistusers = await rcondb.get("whitelist-users");
        guildrcon["creds"] = guildrconcreds;
        guildrcon["whitelist-mod-roles"] = guildrconwhitelistmods;
        guildrcon["whitelist-user-roles"] = guildrconwhitelistusers;
      } catch (e) {
        console.log(e);
        message.channel.send(
          "Rcon has not yet been setup in this server! Please set it up in a private channel (Error 1)"
        );
        message.channel.stopTyping(true);
        return;
      }
      if (!guildrcon["creds"]) {
        message.channel.send(
          "Rcon has not yet been setup in this server! Please set it up in a private channel (Error 2)"
        );
        message.channel.stopTyping(true);
        return;
      }
    }
    switch (args[0]) {
      case "set":
        await whitelistset(message, args, guildrcon, rcondb, displayColor);
        message.channel.stopTyping(true);
        break;
      case "remove":
        await whitelistremove(message, args, guildrcon, rcondb, displayColor);
        message.channel.stopTyping(true);
        break;
      case "mod-group":
        // code block
        await addmodgroup(message, args, guildrcon, rcondb, displayColor);
        message.channel.stopTyping(true);
        break;
      case "remove-group":
        await removegroup(message, args, guildrcon, rcondb, displayColor);
        message.channel.stopTyping(true);
        break;
      case "user-group":
        await addusergroup(message, args, guildrcon, rcondb, displayColor);
        message.channel.stopTyping(true);
        break;

      default:
        message.channel.send({
          embed: {
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
                name: "Whitelist Help:",
                value:
                  "**whitelist set** *username* \n **whitelist remove** *(discord @ / username)* Note: only mod whitelist role can specify other users \n **whitelist mod-group** role-name Note: Specifies mod roles\n **whitelist remove-group** role-name \n **whitelist user-group** *role-name* Note: Primarily for Users \n  For whitelist to work in your server you must first have setup the rcon command!"
              }
            ]
          }
        });
        message.channel.stopTyping(true);
        break;
    }
  }
};

async function whitelistset(message, args, guildrcon, rcondb, displayColor) {
  if (!(await checkisuser(message, guildrcon))) {
    return message.channel.send(
      "You do not have permission to add yourself to the server whitelist!"
    );
  }

  //load user data

  var user = await rcondb.get(message.author.id + "-mcname");
  //user set
  var olduser = false;
  if (user) {
    olduser = user;
    await rconcommand("whitelist remove " + olduser, guildrcon, message);
    rcondb.delete(olduser.toLowerCase() + "-discordid");
  }
  user = args[1];
  await rconcommand("whitelist add " + args[1], guildrcon, message);
  //Save whitelist
  rcondb.set(message.author.id + "-mcname", user);
  rcondb.set(user.toLowerCase() + "-discordid", message.author.id);
  //Send confirm
  if (olduser) {
    message.channel.send({
      embed: {
        color: displayColor,
        //sets the time of the request being made
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
            name: `Added!`,
            //Takes the current time subtracted by the time the users message was sent
            //Giving us the ping!
            value: `Added ${args[1]} to the minecraft server whitelist and removed ${olduser}`
          }
        ]
      }
    });
  } else {
    message.channel.send({
      embed: {
        color: displayColor,
        //sets the time of the request being made
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
            name: `Added!`,
            //Takes the current time subtracted by the time the users message was sent
            //Giving us the ping!
            value: `Added ${args[1]} to the minecraft server whitelist!`
          }
        ]
      }
    });
  }
}

async function whitelistremove(message, args, guildrcon, rcondb, displayColor) {
  if (!(await checkisuser(message, guildrcon))) {
    return message.channel.send(
      "You do not have permission to remove yourself to the server whitelist!"
    );
  }
  if (!args[1]) {
    var mcname = await rcondb.get(message.author.id + "-mcname");
    if (mcname) {
      var olduser = mcname;
      await rconcommand("whitelist remove " + olduser, guildrcon, message);
      rcondb.delete(olduser.toLowerCase() + "-discordid");
      rcondb.delete(message.author.id + "-mcname");
      return message.channel.send({
        embed: {
          color: displayColor,
          //sets the time of the request being made
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
              name: `Removed!`,
              //Takes the current time subtracted by the time the users message was sent
              //Giving us the ping!
              value: `Removed ${olduser} from the minecraft server whitelist`
            }
          ]
        }
      });
    } else {
      message.channel.stopTyping(true);
      return message.channel.send(
        "You do not have a whitelisted user associated with your discord account!"
      );
    }
  } else {
    if (!(await checkismod(message, guildrcon))) {
      return message.channel.send(
        "You do not have permission to run this command"
      );
    }
    var user;
    if (message.mentions.members.first()) {
      var discordid = message.mentions.members.first().id;
      user = await rcondb.get(discordid + "-mcname");
      if (user) {
        //user exists
        await rconcommand("whitelist remove " + user, guildrcon, message);
        rcondb.delete(user.toLowerCase() + "-discordid");
        rcondb.delete(discordid + "-mcname");
        return message.channel.send({
          embed: {
            color: displayColor,
            //sets the time of the request being made
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
                name: `Removed!`,
                //Takes the current time subtracted by the time the users message was sent
                //Giving us the ping!
                value: `Removed ${user} from the minecraft server whitelist (${message.mentions.members.first()})`
              }
            ]
          }
        });
      } else {
        //user dosent have a whitelist set
        return message.channel.send({
          embed: {
            color: displayColor,
            //sets the time of the request being made
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
                name: `Error`,
                //Takes the current time subtracted by the time the users message was sent
                //Giving us the ping!
                value: `Could not find ${message.mentions.members.first()} on the minecraft server whitelist!`
              }
            ]
          }
        });
      }
    } else {
      //minecraft username specified
      user = args[1];
      discordid = await rcondb.get(user.toLowerCase() + "-discordid");
      if (discordid) {
        //found minecraft user
        await rconcommand("whitelist remove " + user, guildrcon, message);
        rcondb.delete(user.toLowerCase() + "-discordid");
        rcondb.delete(discordid + "-mcname");
        return message.channel.send({
          embed: {
            color: displayColor,
            //sets the time of the request being made
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
                name: `Removed!`,
                //Takes the current time subtracted by the time the users message was sent
                //Giving us the ping!
                value: `Removed ${user} from the minecraft server whitelist (${message.mentions.members.first()})`
              }
            ]
          }
        });
      }
      {
        //could not find minecraft username
        await rconcommand("whitelist remove " + user, guildrcon, message);
        return message.channel.send({
          embed: {
            color: displayColor,
            //sets the time of the request being made
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
                name: `Removed!`,
                //Takes the current time subtracted by the time the users message was sent
                //Giving us the ping!
                value: `Removed ${user} from the minecraft server whitelist.\n Note: User was not found in the whitelist database. It is possible they were not whitelisted at all.`
              }
            ]
          }
        });
      }
    }
  }
}

async function rconcommand(cmd, guildrcon, message) {
  const Rcon = require("modern-rcon");
  const rcon = new Rcon(
    guildrcon["creds"][0],
    (port = guildrcon["creds"][1]),
    guildrcon["creds"][2]
  );
  await rcon
    .connect()
    .then(() => {
      return rcon.send(cmd); // That's a command for Minecraft
    })
    .catch(e => {
      console.log(e);
      message.channel.send(
        "Failed to connect to server, please try again later or update the rcon config!"
      );
    })
    .then(() => {
      rcon.disconnect();
    });
}

async function addmodgroup(message, args, guildrcon, rcondb, displayColor) {
  if (!message.member.hasPermission("MANAGE_GUILD")) {
    return message.channel.send(
      'Only users with the permission"Manage Server" are allowed to run this command!'
    );
  }
  var modroles = guildrcon["whitelist-mod-roles"];
  if (message.mentions.roles.first()) {
    if (!modroles) {
      modroles = [];
    } else {
      if (modroles.includes(message.mentions.roles.first().id)) {
        return message.channel.send("That role is already in the mod list!");
      }
    }
    modroles.push(message.mentions.roles.first().id);
    guildrcon["whitelist-mod-roles"] = modroles;
    updatedb(guildrcon, rcondb);
    return message.channel.send({
      embed: {
        color: displayColor,
        //sets the time of the request being made
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
            name: `Role Assigned!`,
            //Takes the current time subtracted by the time the users message was sent
            //Giving us the ping!
            value: `Added ${message.mentions.roles.first()} to mods`
          }
        ]
      }
    });
  } else {
    if (args[1]) {
      try {
        var role = message.guild.roles.cache.find(r => r.name == args[1]);
      } catch (e) {
        console.log(e);
        return message.channel.send(
          `Could not find a role with the name of ${args[1]}`
        );
      }
      if (!role) {
        return message.channel.send(
          `Could not find a role with the name of ${args[1]}`
        );
      }
      if (!modroles) {
        modroles = [];
      } else {
        if (modroles.includes(role.id)) {
          return message.channel.send("That role is already in the mod list!");
        }
      }
      modroles.push(role.id);
      guildrcon["whitelist-mod-roles"] = modroles;
      updatedb(guildrcon, rcondb);
      return message.channel.send({
        embed: {
          color: displayColor,
          //sets the time of the request being made
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
              name: `Role Assigned`,
              //Takes the current time subtracted by the time the users message was sent
              //Giving us the ping!
              value: `Added ${role} to mods`
            }
          ]
        }
      });
    } else {
      return message.channel.send("You have not specified a role!");
    }
  }
}

async function removegroup(message, args, guildrcon, rcondb, displayColor) {
  if (!(await checkismod(message, guildrcon))) {
    return message.channel.send(
      "You do not have permission to run this command!"
    );
  }
  var roleid;
  if (message.mentions.roles.first()) {
    roleid = message.mentions.roles.first().id;
    if (guildrcon["whitelist-user-roles"].includes(roleid)) {
      guildrcon["whitelist-user-roles"].splice(
        guildrcon["whitelist-user-roles"].indexOf(roleid),
        1
      );
      updatedb(guildrcon, rcondb);
      return message.channel.send({
        embed: {
          color: displayColor,
          //sets the time of the request being made
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
              name: `Removed Role Assignment!`,
              //Takes the current time subtracted by the time the users message was sent
              //Giving us the ping!
              value: `Removed ${message.mentions.roles.first()} from users`
            }
          ]
        }
      });
    } else {
      if (guildrcon["whitelist-mod-roles"].includes(roleid)) {
        guildrcon["whitelist-mod-roles"].splice(
          guildrcon["whitelist-mod-roles"].indexOf(roleid),
          1
        );
        updatedb(guildrcon, rcondb);
        return message.channel.send({
          embed: {
            color: displayColor,
            //sets the time of the request being made
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
                name: `Removed Assigned Role!`,
                //Takes the current time subtracted by the time the users message was sent
                //Giving us the ping!
                value: `Removed ${message.mentions.roles.first()} from mods`
              }
            ]
          }
        });
      } else
        return message.channel.send(
          `${
            message.mentions.roles.first().name
          } was not found to be specified as a user/mod role!`
        );
    }
  } else {
    if (args[1]) {
      try {
        var role = message.guild.roles.cache.find(r => r.name == args[1]);
      } catch (e) {
        console.log(e);
        return message.channel.send(
          `Could not find a role with the name of ${args[1]}`
        );
      }
      if (!role) {
        return message.channel.send(
          `Could not find a role with the name of ${args[1]}`
        );
      }
      if (!guildrcon["whitelist-user-roles"]) {
        guildrcon["whitelist-user-roles"] = [];
      }
      roleid = role.id;
      if (guildrcon["whitelist-user-roles"].includes(roleid)) {
        guildrcon["whitelist-user-roles"].splice(
          guildrcon["whitelist-user-roles"].indexOf(roleid),
          1
        );
        updatedb(guildrcon, rcondb);
        return message.channel.send({
          embed: {
            color: displayColor,
            //sets the time of the request being made
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
                name: `Removed Assigned Role!`,
                //Takes the current time subtracted by the time the users message was sent
                //Giving us the ping!
                value: `Removed ${role} from users`
              }
            ]
          }
        });
      } else {
        if (!guildrcon["whitelist-mod-roles"]) {
          guildrcon["whitelist-mod-roles"] = [];
        }
        if (guildrcon["whitelist-mod-roles"].includes(roleid)) {
          guildrcon["whitelist-mod-roles"].splice(
            guildrcon["whitelist-mod-roles"].indexOf(roleid),
            1
          );
          updatedb(guildrcon, rcondb);
          return message.channel.send({
            embed: {
              color: displayColor,
              //sets the time of the request being made
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
                  name: `Removed Assigned Role!`,
                  //Takes the current time subtracted by the time the users message was sent
                  //Giving us the ping!
                  value: `Removed ${role} from mods`
                }
              ]
            }
          });
        } else
          return message.channel.send(
            `${args[1]} was not found to be specified as a user/mod role!`
          );
      }
    } else return message.channel.send("You need to specify a role!");
  }
}

async function addusergroup(message, args, guildrcon, rcondb, displayColor) {
  if (!message.member.hasPermission("MANAGE_GUILD")) {
    return message.channel.send(
      'Only users with the permission"Manage Server" are allowed to run this command!'
    );
  }
  var userroles = guildrcon["whitelist-user-roles"];
  if (message.mentions.roles.first()) {
    if (!userroles) {
      userroles = [];
    } else {
      if (userroles.includes(message.mentions.roles.first().id)) {
        return message.channel.send("That role is already in the user list!");
      }
    }
    userroles.push(message.mentions.roles.first().id);
    guildrcon["whitelist-user-roles"] = userroles;
    updatedb(guildrcon, rcondb);
    return message.channel.send({
      embed: {
        color: displayColor,
        //sets the time of the request being made
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
            name: `Assigned Role!`,
            //Takes the current time subtracted by the time the users message was sent
            //Giving us the ping!
            value: `Added ${message.mentions.roles.first()} to users`
          }
        ]
      }
    });
  } else {
    if (args[1]) {
      try {
        var role = message.guild.roles.cache.find(r => r.name == args[1]);
      } catch (e) {
        console.log(e);
        return message.channel.send(
          `Could not find a role with the name of ${args[1]}`
        );
      }
      if (!role) {
        return message.channel.send(
          `Could not find a role with the name of ${args[1]}`
        );
      }
      if (!userroles) {
        userroles = [];
      } else {
        if (userroles.includes(role.id)) {
          return message.channel.send("That role is already in the user list!");
        }
      }
      userroles.push(role.id);
      guildrcon["whitelist-user-roles"] = userroles;
      updatedb(guildrcon, rcondb);
      return message.channel.send({
        embed: {
          color: displayColor,
          //sets the time of the request being made
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
              name: `Role Assigned!`,
              //Takes the current time subtracted by the time the users message was sent
              //Giving us the ping!
              value: `Added ${role} to users`
            }
          ]
        }
      });
    }
  }
}

async function checkismod(message, guildrcon) {
  const modroles = guildrcon["whitelist-mod-roles"];
  if (message.member.hasPermission("ADMINISTRATOR")) {
    return true;
  } else {
    if (modroles) {
      var ismod = false;
      for (var i = 0; i < modroles.length; i++) {
        if (message.member.roles.cache.has(modroles[i])) {
          ismod = true;
          return true;
        }
      }
      if (!ismod) {
        return false;
      }
    } else return false;
  }
}

async function checkisuser(message, guildrcon) {
  const userroles = guildrcon["whitelist-user-roles"];
  if (await checkismod(message, guildrcon)) {
    return true;
  } else {
    if (userroles) {
      var isuser = false;
      for (var i = 0; i < userroles.length; i++) {
        if (message.member.roles.cache.has(userroles[i])) {
          isuser = true;
          return true;
        }
      }
      if (!isuser) {
        return false;
      }
    } else return false;
  }
}

async function updatedb(guildrcon, rcondb) {
  var guildrconwhitelistmods = guildrcon["whitelist-mod-roles"];
  var guildrconwhitelistusers = guildrcon["whitelist-user-roles"];
  rcondb.set("whitelist-mods", guildrconwhitelistmods);
  rcondb.set("whitelist-users", guildrconwhitelistusers);
}
