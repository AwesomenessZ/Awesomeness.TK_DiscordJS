const Discord = require('discord.js');
const Keyv = require('keyv');
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
        client.user.setActivity(`Master Miner Chat!`, { type: 'WATCHING' }); //Updates the status displaying how many Discord servers the bot is present in
    }, 10000); //10000 = 10 seconds
		//To be run every 3 minutes (180 seconds)
});
//Event handling for every message sent that the bot can read
client.on('message', message => {


	//If receving from server
	if (message.channel.id == 477855444447264780){
		newlog(message)
	}


	//If sending to server
  if (message.channel.id != 674748183074832405) return;//If the message is not intended for the bot we stop processing it
		if(message.member == null) return //If they arent a member of the guilde (Ex: Webhook)
		if(message.attachments.size > 0){
			sendattachment(message)
			return
		}
    if(!message.member.roles.some(r=>["Dev", "🔰 Staff 🔰", "verified"].includes(r.name))) {
      return
    }
		sendmessage(message)
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




async function sendtoservers(command){
	const curl = new (require( 'curl-request' ))();
	//Sending to New Server
	await curl
	//Curl post content to send
	.setBody({
		'ip': 'direct.awesomeness.tk',
		'port': '19132',
		'password': 'bmZNUmZjV0xKdA==',
		'command': `${command}`
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
	//Sending to OLD PM
			curl
			//Curl post content to send
			.setBody({
				'ip': 'prisonminer.leet.cc',
				'port': '56100',
				'password': 'WUIwT0o4',
				'command': `${command}`
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
}


async function newlog(message){
	var username
	var args
	var avatar
	if(message.content.startsWith("***")){
		args = message.content.slice(3)
		var guild = message.guild
		args = args.split(' ')
		if(args[1] == "Pairing"){
			discordlinking(args,guild)
		}
		return
	}
	if(message.content.startsWith("```")){
		args = message.content.slice(3)
		args = args.split(' ')
		username = args[0]
		avatar = await findavatar(message,username)
		if(args[1] == "left")	msg = "***Left the game***"
		if(args[1] == "joined")	msg = "***Joined the game***"
		if(msg != ""){
		sendwebhook(username, avatar, msg)}
		return
	}
	args = message.content.split(' ')
	username = args[0]
		for (var i = 0; i < 5; i++) {
			args.shift()}
		var msg = args.join(' ')
		msg = msg.replace('@here','here');
		msg = msg.replace('@everyone','everyone');
		avatar = await findavatar(message,username)
	//Sending the Webhook
	sendwebhook(username, avatar, msg)
}



async function discordlinking(args,guild){
	const links = new Keyv('mongodb://localhost:27017/mmchat');
	var discordname = args[4]
	var mcname = args[2]
	var discord_user = client.users.find("username", discordname)
	var discord_userid = discord_user.id

	var olddis = await links.get(mcname)
	if(!isNaN(olddis)){
		const role = guild.roles.get("675120260676059147")
		discord_user = guild.members.get(olddis)
		discord_user.removeRole(role)

		await links.delete(olddis)
		await links.delete(mcname)
	}

	links.set(mcname, discord_userid)
	links.set(discord_userid, mcname)

	const role = guild.roles.get("675120260676059147")
	discord_user = guild.members.get(discord_userid)
	discord_user.addRole(role)
	sendtoservers(`cmd run inform ${mcname} §aPairing completed! Your chat messages will now contain your profile picture and you can now talk on the server from discord!`)
}



async function minecraftfind(id){
	const links = new Keyv('mongodb://localhost:27017/mmchat');
	var username = await links.get(id)
	if(username){
		return username
	}
	return false
}

async function discordfind(username){
	const links = new Keyv('mongodb://localhost:27017/mmchat');
	var id = await links.get(username)
	if(id){
		return id
	}
	return false
}


async function sendmessage(message){
	const msgto = message.content
	var userto = message.member.displayName
	var mcuser = await minecraftfind(message.member.id)
	if(mcuser != false){
		userto = mcuser
	}
	sendtoservers(`cmd run from_discord ${userto} ${msgto}`)
}



async function findavatar(message,username){
	var avatar = "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png"
	if((client.users.get("displayName", username)) != undefined){
		avatar = client.users.get("displayName", username).user.avatarURL
	}
	var id = await discordfind(username)
	if(!isNaN(id)){
		avatar = client.users.get(id).avatarURL
	}
	return avatar
}



async function sendattachment(message){
	var attached = (message.attachments).array();
	const msgto = message.content + " " + attached[0].filename
	var userto = message.member.displayName
	var mcuser = await minecraftfind(message.member.id)
	if(mcuser != false){
		userto = mcuser
	}
	sendtoservers(`cmd run from_discord ${userto} ${msgto}`)
}
