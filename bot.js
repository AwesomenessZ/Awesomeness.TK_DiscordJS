const fs = require("fs");
const { prefix, token } = require("./config.json");
const Discord = require("discord.js");
const Keyv = require("keyv");
// create a new Discord client
const client = new Discord.Client();
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
  var guilds = client.guilds.size;
  console.log(`Bot presence on ${guilds} guilds`);
  var loadchannel = client.channels.get("617154686406885411");
  loadchannel.send(`${client.user.tag} is now online on ${guilds} guilds!`);
});
//Bot Turning off
client.once("disconnect", () => {
  console.log(`Discord Bot ${client.user.tag} is now Offline!`);
  var guilds = client.guilds.size;
  console.log(`Bot presence on ${guilds} guilds`);
  var loadchannel = client.channels.get("617154686406885411");
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
    `with ${client.guilds.size} guilds`,
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
  var loadchannel = client.channels.get("617154686406885411");
  loadchannel.send(
    `${client.user.tag} is now in "${guild.name}" for a total of ${client.guilds.size} guilds!`
  );
  loadchannel = client.channels.get("627880075140005908");
  loadchannel.send(
    `${client.user.tag} is now in "${guild.name}" for a total of ${client.guilds.size} guilds!`
  );
});
//executed when the bot has left a server for a varity of reasons (kicked,banned,server deleted, ect..)
client.on("guildDelete", function(guild) {
  //Logs to console the event and logs to a specific logging chanel
  console.log(`the client deleted/left a guild`);
  var loadchannel = client.channels.get("617154686406885411");
  loadchannel.send(
    `${client.user.tag} is no longer in "${guild.name}" for a total of ${client.guilds.size} guilds`
  );
  loadchannel = client.channels.get("627880075140005908");
  loadchannel.send(
    `${client.user.tag} is no longer in "${guild.name}" for a total of ${client.guilds.size} guilds`
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
  var channel = client.channels.get(guildSCH);
  const message = await channel.fetchMessage(guildSID);
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
      const updated = new Discord.RichEmbed()
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
        .setThumbnail(message.guild.iconURL);

      //Sending the new updated message to replace the old message
      message.edit(updated);
      //Stopping the bot from displaying as typing so that users can see
      //any potential changes have been made
      message.channel.stopTyping(true);
    }
  }
}

async function checkreminders() {
  const remindersdb = new Keyv("sqlite://commands/db/reminders.db");
}
