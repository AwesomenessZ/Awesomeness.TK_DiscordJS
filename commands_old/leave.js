module.exports = {
	//Defines properties
	name: 'leave',
	description: 'Leave The channels!! | Only <@176131037049389057> can run this for now!',
  args: true,
  useage: "<channel id>",
	//code to be executed
	execute(message, args, displayColor, client) {
    if(message.author.id != "176131037049389057"){
      return message.reply("Your not <@176131037049389057> !")
    }
    var id = args[0]
    var vc = client.channels.get(id)
    vc.leave()
  }}
