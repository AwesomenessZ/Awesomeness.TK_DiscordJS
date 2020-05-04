module.exports = {
	//Defines properties of the command
	name: 'kick',
	description: 'Kicks players from guilds!',
  guildOnly: true,
  args: true,
  usage: '<user>',
	//Code to be executed
  execute(message, args) {
    // Checks if the user running the command has the permission to kick players themselves
    if(!message.member.hasPermission("KICK_MEMBERS"))
      return message.reply("Sorry, you don't have permissions to use this!")
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Unknown User!")
    if(!member.kickable)
      return message.reply("I do not have permission to kick this user!")
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ')
    if(!reason) reason = "No reason provided"

    // Now, time for a swift kick!
     member.kick(reason)
      .catch(error => message.reply(`An Erorr has occured, please contact AwesomenessZ#3945: ${error}`));
    message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag} for: ${reason}`);

  },
};
