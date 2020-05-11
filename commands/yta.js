module.exports = {
	//Defines properties
	name: 'yta',
	description: 'Plays Audio from youtube videos!',
  args: true,
	aliases: ['youtube','play', 'y'],
  usage: "play <url>/<search> | stop | skip | queue | pause | resume | volume",
	//code to be executed
execute(message, args, displayColor, client, queues, connection, dispatchers) {
	if(args[0] == "play" || args[0] == "p"){
		if(!args[1]){
			if(message.member.voiceChannel){
				if(message.member.voiceChannel.members.has("549328310442917921")){
					if(dispatchers[message.guild.id]){
						dispatchers[message.guild.id].resume()
						message.channel.send({embed: {
							color: displayColor,
							title: `${message.guild.name}'s Music has been resumed!'`,
							//sets the time of the request being made
							timestamp: new Date(),
							footer: {
								text: `Requested by ${message.author.username}`,
								icon_url:`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
							},
						}});
					}
					else{
						message.reply("Usage: /yta p <url> or /yta p <search query>")
					}
				}
				else{
					message.reply("Usage: /yta p <url> or /yta p <search query>")
				}
			}
			else{
				message.reply("Usage: /yta p <url> or /yta p <search query>")
			}
			return
		}
		var search = args
		if(message.member.voiceChannel){
		var link = args[1]
    var vc = message.member.voiceChannel
		const YouTube = require('simple-youtube-api');
		const youtube = new YouTube('AIzaSyAWRX5cdyVUJUfeAeDPhYbM8sUPbLR7EVA');
		if(args[1].startsWith("https://youtube.com/watch?v") || args[1].startsWith("https://www.youtube.com/watch?v")){
			youtube.getVideo(link)
			.then(video => {
				play(message, connection, vc, link, displayColor, queues, dispatchers, video)
				message.channel.send({embed: {
					color: displayColor,
					url: `https://youtube.com/watch?v=${video.id}`,
					//sets the time of the request being made
					timestamp: new Date(),
					title: `Added to Queue in ${vc.name}:`,
					footer: {
						text: `Requested by ${message.author.username}`,
						icon_url:`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
					},
					fields: [
						{
							name: (video.title),
							value: (video.description.substring(0, 50) + "..."),
						}]

					}})
			})
			.catch(console.log);
		} // End of direct Link
		else{ // If not a direct link
			link = search.shift()
			search = search.join(" ")
			youtube.searchVideos(search, 2)
			.then(results => {
			message.channel.send({embed: {
				color: displayColor,
				url: `https://youtube.com/watch?v=${results[0].id}`,
				//sets the time of the request being made
				timestamp: new Date(),
				title: `Added to Queue in ${vc.name}:`,
				footer: {
					text: `Requested by ${message.author.username}`,
					icon_url:`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
				},
				fields: [
					{
						name: (results[0].title),
						value: (results[0].description.substring(0, 50) + "..."),
					}]

				}})
				link = `https://youtube.com/watch?v=${results[0].id}`
				play(message, connection, vc, link, displayColor, queues, dispatchers, results[0])
			})
			.catch(console.log);
		}
		return
    }
		else{
			message.reply("Your not in a vc!")
				}
		return
	} //End of play
	if(args[0] == "stop" || args[0] == "leave"){
		if(message.member.voiceChannel){
			var vc = message.member.voiceChannel
			vc.leave()
			queues[message.guild.id] = []
			connection[message.guild.id] = null
		}
		else{
			message.reply("Your not in a vc!")
		}
		return
	} //End of stop
	if(args[0] == "skip" || args[0] == "s"){
		if(message.member.voiceChannel){
			if(message.member.voiceChannel.members.has("549328310442917921")){
				dispatchers[message.guild.id].end()
				sendqueue(message, queues, displayColor)
			}
			else{
				message.channel.send("I'm not in a voice channel with you!")
			}
		}
		else{
			message.channel.send("Your not in a voice channel!")
		}
		return
	} //End of skip
	if(args[0] == "queue" || args[0] == "q" || args[0] == "np" || args[0] == "nowplaying"){
		if(queues[message.guild.id]){
			if(queues[message.guild.id][0]){
				sendqueue(message, queues, displayColor)
			}
			else message.reply("There is no active queue!")
		}
		else message.reply("There is no active queue!")
		return
	} // End of queue
	if(args[0] == "v" || args[0] == "volume"){
		if(message.member.voiceChannel){
			if(message.member.voiceChannel.members.has("549328310442917921")){
				if(message.member.hasPermission("ADMINISTRATOR")){
					dispatchers[message.guild.id].setVolumeLogarithmic(args[1]/100)
					sendvolume((args[1]/100), message, displayColor)
					queues[message.guild.id + "_v"] = (args[1]/100)
				}
				else{
					var temp = (args[1] / 100)
					if(temp > .5){
						dispatchers[message.guild.id].setVolumeLogarithmic(.5)
						message.reply("You are not an administrator! You are limited to setting the volume up to 50%!")
						sendvolume(.5, message)
						queues[message.guild.id + "_v"] = (.5)
					}
					else{
						dispatchers[message.guild.id].setVolumeLogarithmic(args[1]/100)
						sendvolume((args[1]/100), message, displayColor)
						queues[message.guild.id + "_v"] = (args[1]/100)
					}
				}
			}
			else{
				message.reply("I'm not in a voice channel with you!")
			}
		}
		else{
			message.reply("Your not in a voice channel!")
		}
		return
	} //End of volume
	if(args[0] == "pause"){
		if(message.member.voiceChannel){
			if(message.member.voiceChannel.members.has("549328310442917921")){
				dispatchers[message.guild.id].pause()
				message.channel.send({embed: {
					color: displayColor,
					title: `${message.guild.name}'s Music has been paused!'`,
					//sets the time of the request being made
					timestamp: new Date(),
					footer: {
						text: `Requested by ${message.author.username}`,
						icon_url:`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
					},
	}});
			}
			else{
				message.reply("I'm not in a voice channel with you!")
			}
		}
		else{
			message.reply("Your not in a voice channel!")
		}
		return
	} //End of pause
	if(args[0] == "resume" || args[0] == "r"){
		if(message.member.voiceChannel){
			if(message.member.voiceChannel.members.has("549328310442917921")){
				if(dispatchers[message.guild.id]){
					dispatchers[message.guild.id].resume()
					message.channel.send({embed: {
						color: displayColor,
						title: `${message.guild.name}'s Music has been resumed!'`,
						//sets the time of the request being made
						timestamp: new Date(),
						footer: {
							text: `Requested by ${message.author.username}`,
							icon_url:`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
						},
					}});
				}
				else{
					message.reply("There is nothing to resume!")
				}
			}
			else{
				message.reply("I'm not in the voice channel with you!")
			}
		}
		else{
			message.reply("Your not in a voice channel!")
		}
		return
	} //End of resume
	message.channel.send(`*${args[0]}* is not play/stop/skip/queue/pause/resume/volume!`)
},
};




async function play(message, connection, vc, link, displayColor, queues, dispatchers, video){
	if(queues[message.guild.id]){
		queues[message.guild.id] = queues[message.guild.id].concat(link)
		queues[message.guild.id + "_names"] = queues[message.guild.id + "_names"].concat(video.title)
	}
	else {
		queues[message.guild.id] = []
		queues[message.guild.id] = queues[message.guild.id].concat(link)
		queues[message.guild.id + "_names"] = []
		queues[message.guild.id + "_names"] = queues[message.guild.id + "_names"].concat(video.title)
	}
	if(!connection[message.guild.id]){
					vc.join()
					.then(cmd_connection => { // Connection is an instance of VoiceConnection
						connection[message.guild.id] = cmd_connection
						stream(message, connection, vc, link, displayColor, queues, dispatchers)})
					.catch(err => {
						message.channel.send(`I was unable to join <#${message.channel.id}>!`)
						vc.leave()
						connection[message.guild.id] = null
						console.log(err)
					}
					)
				}
}


async function stream(message, connection, vc, link, displayColor, queues, dispatchers){
	const ytdl = require('ytdl-core');
	const stream = ytdl(queues[message.guild.id][0], { filter: 'audioonly' });
	var parms = new Object();
	parms.volume = ".1"
	parms.bitrate = "auto"
	var dispatcher = connection[message.guild.id].playFile("/home/isaac/discord_bot/join.mp3")
	await new Promise(resolve => setTimeout(resolve, 1500));
	dispatcher = connection[message.guild.id].playStream(stream, parms);
	dispatchers[message.guild.id] = dispatcher
	if(queues[message.guild.id + "_v"]){
		dispatcher.setVolumeLogarithmic(queues[message.guild.id + "_v"])
	}
	dispatcher.on('end', () => {
		next(message, connection, vc, link, displayColor, queues, dispatchers)
	})
}


async function next(message, connection, vc, link, displayColor, queues, dispatchers){
		queues[message.guild.id].shift()
		queues[message.guild.id + "_names"].shift()
		if(queues[message.guild.id].length == 0){
			vc.leave()
			connection[message.guild.id] = null
			message.channel.send("Queue is now empty")
		}
		else{
			stream(message, connection, vc, link, displayColor, queues, dispatchers);
	}
}



async function sendqueue(message, queues, displayColor){
	var meta = titleformat(queues,message)
	var list
	var playing = meta[0]
	playing = playing.substr(3)
	if(meta[1]){
		list = meta
		list.shift()
		if(meta[1]){
			list = list.join("\n")
		}
		else {
			list = list.toString()
		}
	}
	else{
		list = "*None*"
	}



	message.channel.send({embed: {
		color: displayColor,
		title: `Queue for ${message.guild.name}`,
		url: queues[message.guild.id][0],
		//sets the time of the request being made
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.author.username}`,
			icon_url:`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
		},
		fields: [
			{
				name: "Now Playing:",
				value: playing,
			},
			{
				name: "Up comming:",
				value: list,
			}]

		}})
}



function titleformat(queues,message){
	var temp = []
	for (var i = 0; i < queues[message.guild.id].length; i++) {
			temp.push(i + ". *" + queues[message.guild.id + "_names"][i] + "*")
	}
	return temp
}



function sendvolume(volume, message, displayColor){
	message.channel.send({embed: {
		color: displayColor,
		//sets the time of the request being made
		timestamp: new Date(),
		footer: {
			text: `Requested by ${message.author.username}`,
			icon_url:`https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
		},
		fields: [
			{
				name: 'New Volume set:',
				//Takes the current time subtracted by the time the users message was sent
				//Giving us the ping!
				value: (volume*100 + "%"),
			}]

}});
}
