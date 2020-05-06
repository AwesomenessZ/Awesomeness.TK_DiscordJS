module.exports = {
	//Defines properties
	name: 'yta',
	description: 'Plays Audio from youtube videos!',
  args: true,
  usage: "play <url>/<search> | stop",
	//code to be executed
execute(message, args, displayColor) {
	if(args[0] == "play"){
		var search = args
		if(message.member.voiceChannel){
		var link = args[1]
    var vc = message.member.voiceChannel
    vc.join()
    .then(connection => { // Connection is an instance of VoiceConnection
			const YouTube = require('simple-youtube-api');
			const youtube = new YouTube('AIzaSyAWRX5cdyVUJUfeAeDPhYbM8sUPbLR7EVA');
			if(args[1].startsWith("https://youtube.com/watch?v") || args[1].startsWith("https://www.youtube.com/watch?v")){
				play(message, connection, vc, link, displayColor)
				youtube.getVideo(link)
				.then(video => {
					message.channel.send({embed: {
						color: displayColor,
						url: `https://youtube.com/watch?v=${video.id}`,
						//sets the time of the request being made
						timestamp: new Date(),
						title: `Now Playing in ${vc.name}:`,
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
					title: `Now Playing in ${vc.name}:`,
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
					play(message, connection, vc, link, displayColor)
				})
				.catch(console.log);
			}
    })}
		else{
			message.reply("Your not in a vc!")
				}
		return
	} //End of play
	if(args[0] == "stop"){
		if(message.member.voiceChannel){
			var vc = message.member.voiceChannel
			vc.leave()
		}
		else{
			message.reply("Your not in a vc!")
		}
		return
	} //End of stop
	message.channel.send(`*${args[0]}* is not play/stop!`)
},
};


async function play(message, connection, vc, link, displayColor){
	const ytdl = require('ytdl-core');
	const stream = ytdl(link, { filter: 'audioonly' });
	var parms = new Object();
	parms.volume = ".1"
	parms.bitrate = "auto"
	var dispatcher = connection.playFile("/home/isaac/discord_bot/join.mp3");
	await new Promise(resolve => setTimeout(resolve, 1500));
	dispatcher = connection.playStream(stream, parms);
}
