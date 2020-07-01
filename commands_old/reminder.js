module.exports = {
	//Defines properties
	name: 'remind',
	description: 'reminds you to do stuff',
  guildOnly: true,
  args: true,
  usage: '< me | everyone | us | @User> to <remind message> in <XXh | XXd | xxm (hours, days, minutes)>',
	//code to be executed
	execute(message, args, displayColor) {
    var reminderfor
    if (!args[0]){ //testing who the reminder is for
      return message.channel.send("Please specify who the message is for! Accepted values are `me | everyone | us | @User`")
    }
    else {
      if (args[0] == "me" || args[0] == "everyone" || args[0] == "us" || args[0].startsWith("<@") || args[0] == "here"){
        if(args[0] == "me"){
          reminderfor = message.author
        }
        if(args[0] == "everyone"){
          reminderfor = "@everyone"
        }
        if(args[0] == "us" || args[0] == "here"){
          reminderfor = "@here"
        }
        if(args[0].startsWith("<@")){
          reminderfor == message.mentions.members.first()
        }
      }
      else{
        return message.channel.send("Please specify who the message is for! Accepted values are `me | everyone | us | @User`")
      }
    } //Done testing who the reminder is for

    //Prosessing msg
    var temp = args
		var time
    temp = args.shift()
    temp = args.shift()
		var inarg = false
    for (var i = 0; i < args.length; i++) { //Grabs the last "in" in the array (should be fool proof)
			if(args[i] == "in" || args[i] == "IN" || args[i] == "In" || args[i] == "iN"){
				inarg = i
			}
			else{
				if(i == args.length && inarg == false){
					return message.channel.send("You didn't specify When you want me to remind you!")
				}
			}
		//Processing what counts as msg
		var msg = args.slice(i)
		//Finding out when they want us to send the message
		if(args[args.length - 1].includes("m") || args[args.length - 1].includes("d") || args[args.length - 1].includes("h")){
			temp = args[args.length - 1]
			if(temp.includes("m")){
				temp.split("")
				if(isNaN(temp[0])){
					return message.channel.send("That is not a valid time!")
				}
				else{
					time = Date.now() + (temp[0] * 1000 * 60)
				}}
			if(temp.includes("h")){
				temp.split("")
				if(isNaN(temp[0])){
					return message.channel.send("That is not a valid time!")
				}
				else{
					time = Date.now() + (temp[0] * 1000 * 60 * 60)
				}
			}
			if(temp.includes("d")){
				temp.split("")
				if(isNaN(temp[0])){
					return message.channel.send("That is not a valid time!")
				}
				else{
					time = Date.now() + (temp[0] * 1000 * 60 * 60 * 24)
				}
			}
		else{
			return message.channel.send("Thats not a valid time!")
		}
	}
}

    const Keyv = require('keyv');
    const remindersdb = new Keyv('mongodb://localhost:27017/reminders');
    var info = [message.channels, reminderfor, msg]
    remindersdb.set(time, info)
  }
}
