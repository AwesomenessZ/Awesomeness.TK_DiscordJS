module.exports = {
	//Defines properties
	name: 'blast',
	description: 'Blast from the past! | Only <@176131037049389057> can run this for now!',
  args: true,
  useage: "<channel id>",
	//code to be executed
execute(message, args, displayColor, client) {
    if(message.author.id != "176131037049389057"){
      return message.reply("Your not <@176131037049389057> !")
    }
    var id = args[0]
    var vc = client.channels.get(id)
    vc.join()
    .then(connection => { // Connection is an instance of VoiceConnection
          play(message, connection, vc)
        })
	},
};


async function play(message, connection, vc){
  message.channel.send('I have successfully connected to the channel!');
  const dispatcher = connection.playFile('/home/isaac/Bebsicolo.mp3');
/*  await sleep(60000)
  var end = false
  while(end == true){
    await sleep(10000)
    if(dispatcher.WritableState.ended == true){
      end = true
    }
  }
  vc.leave()
  console.log(dispatcher)*/
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
