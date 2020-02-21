const Discord = require('discord.js');
// create a new Discord client
const client = new Discord.Client();
// when the client (Discord Bot) is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log(`Discord Bot ${client.user.tag} has logged in successfully`);
	console.log(`Bot precense on ${client.guilds.size} servers`)
});
//Bot Turning off
client.once('disconnect', () => {
	console.log(`Discord Bot ${client.user.tag} is now Offline!`);
});
//Discord Status message
client.on('ready', message => {
		//To be run every 10 seconds
    setInterval(() => {
        client.user.setActivity(`Connected to Master Miner Chat!`); //Updates the status displaying how many Discord servers the bot is present in
    }, 10000); //10000 = 10 seconds
		//To be run every 3 minutes (180 seconds)
});
//Event handling for every message sent that the bot can read
client.on('message', message => {


	//If receving from server
	if (message.channel.id == 477855444447264780){
		var username
		var args
		var avatar
		var guild
		if(message.content.startsWith("```")){
			args = message.content.slice(3)
			args = args.split(' ')
				avatar = "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"
				guild = message.guild
				username = args[0]
				if((guild.members.find("displayName", username)) != undefined){
					avatar = guild.members.find("displayName", username).user.avatarURL
				}
			if(args[1] == "left")	msg = "***Left the game***"
			if(args[1] == "joined")	msg = "***Joined the game***"
			sendwebhook(username, avatar, msg)
			return
		}
		args = message.content.split(' ')
		username = args[0]
			for (var i = 0; i < 5; i++) {
				args.shift()}
			var msg = args.join(' ')
			msg = msg.replace('@here','here');
			msg = msg.replace('@everyone','everyone');
		avatar = "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"
		guild = message.guild
		if((guild.members.find("displayName", username)) != undefined){
			avatar = guild.members.find("displayName", username).user.avatarURL
		}
		//Sending the Webhook
		sendwebhook(username, avatar, msg)

	}


	//If sending to server
  if (message.channel.id != 674748183074832405) return;//If the message is not intended for the bot we stop processing it
    if(message.author.bot) return
    if(!message.member.roles.some(r=>["Dev", "🔰 Staff 🔰", "verified"].includes(r.name))) {
      message.reply("You need to verify your Username!")
      return
    }
		const msgto = message.content
		var userto = message.member.displayName
    const curl = new (require( 'curl-request' ))();

    curl
    //Curl post content to send
    .setBody({
     'ip': 'direct.awesomeness.tk',
     'port': '19132',
     'password': 'bmZNUmZjV0xKdA==',
     'command': `cmd run from_discord ${userto} ${msgto}`
    })
    //Sending the post request
    .post('https://edroid.me/projects/rcon++/beta/client.php')
    //Sending the output to console
    .then(({statusCode, body, headers}) => {
        //console.log(statusCode, body, headers)
    })
    //Sending errors to console
    .catch((e) => {
        console.log(e);
    });
});


// login to Discord with our special token
//This authorizes the bot with the discord api
client.login("Njc0NDE3OTkxOTc0MTI1NTY4.Xjyfkw.rG5ogPKEdaTwfu61G1szxewQsCc");



async function sendwebhook(username, avatar, msg){
		const channel = client.channels.get('674748183074832405');
	try {
		const webhooks = await channel.fetchWebhooks();
		const webhook = webhooks.first();
		await webhook.send(msg, {
			username: username,
			avatarURL: avatar,
		});
	} catch (error) {
	console.error('Error trying to send: ', error);
}
}
