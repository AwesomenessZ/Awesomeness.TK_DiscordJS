const fs = require("fs");
const { prefix, token } = require("./config.json");
const Discord = require("discord.js");
const Keyv = require("keyv");
// create a new Discord client
const client = new Discord.Client({ disableMentions: "everyone" });
client.commands = new Discord.Collection();
var queues = {};
var connection = {};
var dispatchers = {};
// return an array of all the file names in that directory,
//The filter is there to make sure any non-JS files are left out of the array.
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once("ready", () => {
  console.log(`Discord Bot ${client.user.tag} is now Online!`);
  var guilds = client.guilds.cache.size;
  console.log(`Bot presence on ${guilds} guilds`);
  var loadchannel = client.channels.cache.get("617154686406885411");
  loadchannel.send(`${client.user.tag} is now online on ${guilds} guilds!`);
});
//Bot Turning off
client.once("disconnect", () => {
  console.log(`Discord Bot ${client.user.tag} is now Offline!`);
  var guilds = client.guilds.cache.size;
  console.log(`Bot presence on ${guilds} guilds`);
  var loadchannel = client.channels.cache.get("617154686406885411");
  loadchannel.send(`${client.user.tag} is now offline on ${guilds} guilds!`);
});
//Discord Status message
client.on("ready", message => {
  //Set a list of possible status messages
  const status = [
    "with /help",
    "with Your Data!",
    "with Discord.js",
    "Stonk Market",
    "Minecraftcito",
    "the clarinet",
    "with fire",
    "with your heart",
    "Firefox",
    "file explorer",
    "ms paint",
    `with ${client.guilds.cache.size} guilds`,
    "Blender",
    "Russian Roulette",
    "Garry's Mod",
    "Minecraft",
    "GTA V",
    "Capitalism",
    "Comunism",
    "Master Miner",
    "Prison Miner",
    "/yta",
    "at 9001% volume",
    "with your mom",
    "with Dad Bot"
  ]; // TODO Add support for diffrent status types.
  //To be run every 30 seconds
  setInterval(() => {
    const i = Math.floor(Math.random() * (status.length - 1) + 1); //Picks a random number within the range of the array
    client.user.setActivity(status[i]); //Picks a status from the activities_list array
    //checkreminders()
  }, 30000); //30000 = 30 seconds
  //To be run every 3 minutes (180 seconds)
  setInterval(() => {
    //Calls onto a function that checks all of the currently active messages
    //This is done so we can do it async without messing with timers
    runstatus();
  }, 180000); // 180000 = 180 seconds = 3 minutes
});
//executed when the bot has joined a new discord server
client.on("guildCreate", function(guild) {
  //Sends a message to console and a specific channel that logs these changes
  console.log(`Joined a new guild`);
  var loadchannel = client.channels.cache.get("617154686406885411");
  loadchannel.send(
    `${client.user.tag} is now in "${guild.name}" for a total of ${client.guilds.cache.size} guilds!`
  );
  loadchannel = client.channels.cache.get("627880075140005908");
  loadchannel.send(
    `${client.user.tag} is now in "${guild.name}" for a total of ${client.guilds.cache.size} guilds!`
  );
});
//executed when the bot has left a server for a varity of reasons (kicked,banned,server deleted, ect..)
client.on("guildDelete", function(guild) {
  //Logs to console the event and logs to a specific logging chanel
  console.log(`the client deleted/left a guild`);
  var loadchannel = client.channels.cache.get("617154686406885411");
  loadchannel.send(
    `${client.user.tag} is no longer in "${guild.name}" for a total of ${client.guilds.cache.size} guilds`
  );
  loadchannel = client.channels.cache.get("627880075140005908");
  loadchannel.send(
    `${client.user.tag} is no longer in "${guild.name}" for a total of ${client.guilds.cache.size} guilds`
  );
});
//Event handling for every message sent that the bot can read
client.on("message", message => {
  //If the message is not intended for the bot we stop processing it
  if (!message.content.startsWith(prefix)) return;
  //Setup args variable to contain everything but the prefix
  const args = message.content.slice(prefix.length).split(" ");
  //Find the command being envoked (insured by converting to lowercase characters)
  const commandName = args.shift().toLowerCase();
  //Check if Command Exists
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;
  var displayColor;
  if (message.guild) {
    displayColor = message.guild.me.displayColor;
  } else displayColor = "636363";
  //Check if command is Guild-Only and if the user is messaging from a guild (won't work in dms)
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("That command is not avilable outside of guilds!");
  }
  //If the command requires arguments to run and isnt given them
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    //If the proper useage of the command is defined it will show the user the definition
    if (command.usage) {
      reply = `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    //Actually sending the message(s)
    return message.channel.send(reply);
  }
  try {
    //We execute the code for the specified command
    //Code for these can be found in the commands directory located in the current directory
    command.execute(
      message,
      args,
      displayColor,
      client,
      queues,
      connection,
      dispatchers
    );
    /*if (!message.guild == "") {
		message.delete(0)
	}*/
  } catch (error) {
    //If the execute code returns an error we send it to console for debugging and notify the user of the error
    console.log(error);
    message.reply(
      "there was an error trying to execute that command! Please contact AwesomenessZ#3945"
    );
    var loadchannel = client.channels.cache.get("627880075140005908");
    loadchannel.send(error);
  }
});
// login to Discord with our special token
//This authorizes the bot with the discord api
client.login(token);

async function runstatus() {
  //Grabs the amount of status messages we need to update from the database
  const id = new Keyv("sqlite://commands/db/discordbot_Identifers.db");
  var index = await id.get("index");
  if (!index) {
    index = [];
  }
  //Run the following function for every message needing updated
  for (var c = 0; c < index.length - 1; ) {
    c++; //adds to c at the start because message identifiers start at postion 1 not 0
    //c is our current message being worked on
    grabstatus(c, index);
  }
}

//Code to run for status every 3 minutes
async function grabstatus(i, index) {
  //Pull info from databases
  const apikey = new Keyv("sqlite://commands/db/apikeys.db");
  const statusID = new Keyv("sqlite://commands/db/discordbot_statusID.db");
  const statusCH = new Keyv("sqlite://commands/db/discordbot_statusCH.db");
  //Selecting what data we want to be currently working with
  var guildSCH = await statusCH.get(index[i]);
  var guildSID = await statusID.get(index[i]);
  //Telling Discord.js what channel and message we want to be currently working with
  var channel = await client.channels.cache.get(guildSCH).catch(error => {
    message.channel.send("Could not find channel " + i);
    console.log(error);
    return;
  });
  //Removes from index if no longer exists
  var message = await channel.messages.fetch(guildSID).catch(error => {
    console.log("Could not find Status Message " + i);
    console.log(error);
    return;
  });
  var guild = message.guild.id;
  var guildapi = await apikey.get(guild);
  //Start typing so that users know the message is being worked on
  message.channel.startTyping();
  //If we dont know what server we should be checking the status of we send an error
  if (!guildapi) {
    message.channel.send(
      `An api key hasn't been provided for this discord server! (${message.guild.name})\nAdd it with /apikey <key>`
    );
    message.channel.stopTyping(true);
  }
  //If for some reason we have the chanel id but not the message id we tell the users
  if (!guildSID) {
    channel.send(
      `Cannot find the message ${guildSID}! Please remove the status message and recreate it!`
    );
    channel.stopTyping(true);
  }
  if (guildapi) {
    if (guildSID) {
      //Only runs if we have everything we need
      //Going to make a curl request to an outside api
      const { curly } = require("node-libcurl");
      const { data } = await curly.get(
        `https://minecraftpocket-servers.com/api/?object=servers&element=detail&key=${guildapi}`
      );
      //converting the output of the request into a form the code can work with easier
      const json = data;
      const jsn = JSON.parse(json);
      //Changing the properties of the message that is being updated
      const updated = new Discord.MessageEmbed()
        .setTimestamp(new Date())
        .setColor(message.guild.me.displayColor)
        .addField(
          "Online players:",
          `**__${jsn.players}/${jsn.maxplayers}__**`,
          false
        )
        .addField(
          "Ranking:",
          `With ${jsn.votes} votes it currently ranks #${jsn.rank}. Vote on [this website!](${jsn.url}vote)`,
          false
        )
        .setURL(`${jsn.url}vote`)
        .setTitle(`${jsn.name}'s status:`)
        .setImage(
          `https://minecraftpocket-servers.com/server/${jsn.id}/banner-${jsn.id}.gif`
        )
        .setThumbnail(message.guild.iconURL());

      //Sending the new updated message to replace the old message
      message.edit(updated);
      //Stopping the bot from displaying as typing so that users can see
      //any potential changes have been made
      message.channel.stopTyping(true);
    }
  }
}

async function removeStatus(identifier) {
  return;
  //To be fixed after v12 upgrade
  const Keyv = require("keyv");
  const id = new Keyv("sqlite://commands/db/discordbot_Identifers.db");
  var index = await id.get("index");
  if (!index) {
    index = [];
  }
  var guildSCH;
  if (!identifier) {
    var loadchannel = client.channels.cache.get("627880075140005908");
    loadchannel.send(
      "Could not delete status message in a channel that no longer exists"
    );
    return;
  }

  const valueToRemove = index[identifier];
  const filteredItems = index.filter(item => item !== valueToRemove);
  await id.set("index", filteredItems);
  var loadchannel = client.channels.cache.get("627880075140005908");
  loadchannel.send(
    `Deleted ${valueToRemove} (id: ${identifier}) as the channel no longer exists!`
  );
}

async function checkreminders() {
  const remindersdb = new Keyv("sqlite://commands/db/reminders.db");
}

//Master Miner chat
//Master Miner Chat
client.on("message", message => {
  //If receving from server
  if (message.channel.id == 477855444447264780) {
    newlog(message);
  }

  //If sending to server
  if (message.channel.id != 834501929530818560) return; //If the message is not intended for the bot we stop processing it
  if (message.member == null) return; //If they arent a member of the guilde (Ex: Webhook)
  if (message.attachments.size > 0) {
    sendattachment(message);
    return;
  }
  if (
    !message.member.roles.cache.some(r =>
      ["Dev", "Staff", "verified"].includes(r.name)
    )
  ) {
    return;
  }
  sendmessage(message);
});

async function sendwebhook(username, avatar, msg) {
  const channel = client.channels.cache.get("834501929530818560");
  try {
    const webhooks = await channel.fetchWebhooks();
    const webhook = webhooks.first();
    await webhook.send(msg, {
      username: username,
      avatarURL: avatar
    });
  } catch (error) {
    console.error("Error trying to send: ", error);
  }
}

//Sending to New Server
async function sendtoservers(command) {
  const Rcon = require("modern-rcon");
  const rcon = new Rcon("prisonminer.leet.cc", (port = 56100), "8ZYONF6");
  rcon
    .connect()
    .then(() => {
      return rcon.send(command); // That's a command for Minecraft
    })
    .then(res => {
      console.log(res);
    })
    .then(() => {
      return rcon.disconnect();
    });
}

async function newlog(message) {
  var username;
  var args;
  var avatar;
  if (message.content.startsWith("***")) {
    args = message.content.slice(3);
    var guild = message.guild;
    args = args.split(" ");
    if (args[1] == "Pairing") {
      discordlinking(args, guild);
    }
    return;
  }
  if (message.content.startsWith("```")) {
    args = message.content.slice(3);
    args = args.split(" ");
    username = args[0];
    avatar = await findavatar(message, username);
    if (args[1] == "left") msg = "***Left the game***";
    if (args[1] == "joined") msg = "***Joined the game***";
    if (msg != undefined) {
      sendwebhook(username, avatar, msg);
    }
    return;
  }
  args = message.content.split(" ");
  username = args[0];
  for (var i = 0; i < 5; i++) {
    args.shift();
  }
  for (var c = 0; c < args.length; c++) {
    if (args[c].startsWith("@")) {
      var mention = client.users.cache.find(
        user => user.username == args[c].replace("@", "")
      );
      if (mention) {
        args[c] = `<@${mention.id}>`;
      }
    }
  }
  var msg = args.join(" ");
  if (msg.includes("@here") || msg.includes("@everyone")) {
    sendtoservers(
      `kick ${username} Trying to @\\here or @\\everyone on discord.`
    );
    sendtoservers(
      `message §6[§4ALERT§6] §e ${username} §b tryed to mass mention!`
    );
    msg = msg.replace("@here", "{PING}");
    msg = msg.replace("@everyone", "{PING}");
    var notice = client.channels.cache.get("478288700833398790");
    notice.send({
      embed: {
        color: message.guild.me.displayColor,
        timestamp: new Date(),
        title: `WARNING:`,
        footer: {
          text: `Mass ping attempt by ${username}`
        },
        fields: [
          {
            name: "Minecraft Name:",
            value: username
          },
          {
            name: `Message:`,
            value: `${msg}`
          }
        ]
      }
    });
    return;
  }
  avatar = await findavatar(message, username);
  //Sending the Webhook
  sendwebhook(username, avatar, msg);
}

async function discordlinking(args, guild) {
  const links = new Keyv("sqlite://commands/db/mmchat.db");
  var discordname = args[4].replace(/&/g, " ");
  var mcname = args[2];
  console.log(mcname + " " + discordname);
  var discord_user = client.users.cache.find(
    user => user.username == discordname
  );
  if (!discord_user) {
    sendtoservers(
      `cmd run inform ${mcname} §cPairing Failed! We could not find your discord account! Please make sure that you have join the Discord Server!`
    );
    console.log(`Failed to pair ${mcname} with ${discordname}`);
    failure(mcname, discordname);
    return;
  }
  var discord_userid = discord_user.id;

  var olddis = await links.get(mcname);
  if (!isNaN(olddis)) {
    const role = guild.roles.cache.get("675120260676059147");
    discord_user = guild.members.cache.get(olddis);
    discord_user.roles.remove(role);

    await links.delete(olddis);
    await links.delete(mcname);
  }

  links.set(mcname, discord_userid);
  links.set(discord_userid, mcname);

  const role = guild.roles.cache.get("675120260676059147");
  discord_user = guild.members.cache.get(discord_userid);
  discord_user.roles.add(role);
  sendtoservers(
    `cmd run inform ${mcname} §aPairing completed! Your chat messages will now contain your profile picture and you can now talk on the server from discord!`
  );
  success(mcname, discord_user);
}

async function minecraftfind(id) {
  const links = new Keyv("sqlite://commands/db/mmchat.db");
  var username = await links.get(id);
  if (username) {
    return username;
  }
  return false;
}

async function discordfind(username) {
  const links = new Keyv("sqlite://commands/db/mmchat.db");
  var id = await links.get(username);
  if (id) {
    return id;
  }
  return false;
}

async function sendmessage(message) {
  var msgto = message.content;
  if (msgto.includes("<@")) {
    msgto = msgto.split(" ");
    for (var c = 0; c < msgto.length; c++) {
      if (msgto[c].startsWith("<@")) {
        var temp = msgto[c].replace("<@", "");
        temp = temp.replace(">", "");
        temp = temp.replace("!", "");
        temp = temp.replace(",", "");
        temp = temp.replace(".", "");
        temp = client.users.cache.find(user => user.id == temp);
        msgto[c] = "@" + temp;
      }
    }
    msgto = msgto.join(" ");
  }
  var userto = message.member.displayName;
  var mcuser = await minecraftfind(message.member.id);
  if (mcuser != false) {
    userto = mcuser;
  }
  sendtoservers(`cmd run from_discord ${userto} ${msgto}`);
}

async function findavatar(message, username) {
  var avatar =
    "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png";
  if (client.users.cache.get("displayName", username) != undefined) {
    avatar = client.users.cache.get("displayName", username).user.avatarURL();
  }
  var id = await discordfind(username);
  if (id > 1000) {
    avatar = client.users.cache.get(id).avatarURL();
  }
  return avatar;
}

async function sendattachment(message) {
  var attached = message.attachments.array();
  const msgto = message.content + " " + attached[0].filename;
  var userto = message.member.displayName;
  var mcuser = await minecraftfind(message.member.id);
  if (mcuser != false) {
    userto = mcuser;
  }
  sendtoservers(`cmd run from_discord ${userto} ${msgto}`);
}

function success(mcname, discord_user) {
  var loadchannel = client.channels.cache.get("477855444447264780");
  loadchannel.messages.fetch({ limit: 1 }).then(messages => {
    let message = messages.first();
    loadchannel.send({
      embed: {
        color: message.guild.me.displayColor,
        timestamp: new Date(),
        title: `Pairing Success!`,
        footer: {
          text: `Requested by ${discord_user.displayName}`,
          icon_url: discord_user.user.avatarURL()
        },
        fields: [
          {
            name: "Minecraft Name:",
            value: mcname
          },
          {
            name: `Discord infromation:`,
            value: `( <@${discord_user.id}> ) \n Id: ${discord_user.id} \n Tag: ${discord_user.user.tag} \n Joined time: ${discord_user.joinedAt}`
          }
        ]
      }
    });
  });
}

function failure(mcname, discordname) {
  var loadchannel = client.channels.cache.get("477855444447264780");
  loadchannel.messages.fetch({ limit: 1 }).then(messages => {
    let message = messages.first();
    loadchannel.send({
      embed: {
        color: message.guild.me.displayColor,
        timestamp: new Date(),
        title: `Pairing Failed!`,
        footer: {
          text: `Requested by ${mcname}`
        },
        fields: [
          {
            name: "Minecraft Name",
            value: mcname
          },
          {
            name: "Discord infromation",
            value: `"Username": ${discordname}`
          }
        ]
      }
    });
  });
}
