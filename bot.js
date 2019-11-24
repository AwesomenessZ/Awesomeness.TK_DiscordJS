const fs = require('fs');
const { prefix, token, pmapikey } = require('./config.json');
const Discord = require('discord.js');
const Keyv = require('keyv');
// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();
// return an array of all the file names in that directory,
//The filter is there to make sure any non-JS files are left out of the array.
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log(`Discord Bot ${client.user.tag} is now Online!`);
	var guilds = client.guilds.size
	console.log(`Bot precense on ${guilds} guilds`)
	var loadchannel = client.channels.get("617154686406885411");
	loadchannel.send(`${client.user.tag} is now online on ${guilds} guilds!`)
});
//Bot Turning off
client.once('disconnect', () => {
	console.log(`Discord Bot ${client.user.tag} is now Offline!`);
	var guilds = client.guilds.size
	console.log(`Bot precense on ${guilds} guilds`)
	var loadchannel = client.channels.get("617154686406885411");
	loadchannel.send(`${client.user.tag} is now offline on ${guilds} guilds!`)
});
//Discord Status message
client.on('ready', message => {
	const activities_list = [
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
	`with ${client.guilds.size} guilds`
    ];
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        client.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
    }, 10000); // Runs this every 10 seconds.
});
//joined a server
client.on("guildCreate", function(guild){
    console.log(`Joined a new guild`);
		var loadchannel = client.channels.get("617154686406885411");
		loadchannel.send(`${client.user.tag} is now in "${guild.name}" for a total of ${client.guilds.size} guilds!`)
		var loadchannel = client.channels.get("627880075140005908");
		loadchannel.send(`${client.user.tag} is now in "${guild.name}" for a total of ${client.guilds.size} guilds!`)
});
//Left a servers
client.on("guildDelete", function(guild){
    console.log(`the client deleted/left a guild`);
		var loadchannel = client.channels.get("617154686406885411");
		loadchannel.send(`${client.user.tag} is no longer in "${guild.name}" for a total of ${client.guilds.size} guilds`)
		var loadchannel = client.channels.get("627880075140005908");
		loadchannel.send(`${client.user.tag} is no longer in "${guild.name}" for a total of ${client.guilds.size} guilds`)
});
//When a user completes an action these will trigger
client.on('message', message => {
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(' ');
  const commandName = args.shift().toLowerCase();
  //// NOTE: Checking if Command Exists
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  if (!command) return;
  //// NOTE: Check if command is Guild-Only
  if (command.guildOnly && message.channel.type !== 'text') {
	return message.reply('That command is not avilable outside of guilds!');
}
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply = `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }
try {
	command.execute(message, args);
	if (!message.guild == "") {
		message.delete(0)
	}
} catch (error) {
	console.log(error);
	message.reply("there was an error trying to execute that command! Please contact AwesomenessZ#3945");
}
});
// login to Discord with your app's token
client.login(token);
