module.exports = {
	//Defines properties
	name: 'yta',
	description: 'Plays Audio from youtube videos!',
  args: true,
  usage: "play <url>/<search> | stop",
	//code to be executed
execute(message, args, displayColor, client, queues, connection, dispatchers) {
	if(args[0] == "play"){
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
	if(args[0] == "stop"){
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
	if(args[0] == "skip"){
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
	if(args[0] == "queue"){
		if(queues[message.guild.id]){
			if(queues[message.guild.id][0]){
				sendqueue(message, queues, displayColor)
			}
			else message.reply("There is no active queue!")
		}
		else message.reply("There is no active queue!")
		return
	}
	message.channel.send(`*${args[0]}* is not play/stop!`)
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
