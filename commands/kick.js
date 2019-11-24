module.exports = {
	name: 'kick',
	description: 'Kicks players from guilds!',
  guildOnly: true,
  args: true,
  usage: '<user>',
  execute(message, args) {
	// This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit:
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.hasPermission("KICK_MEMBERS"))
      return message.reply("Sorry, you don't have permissions to use this!");

    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Unknown User!");
    if(!member.kickable)
      return message.reply("I do not have permission to kick this user!");

    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";

    // Now, time for a swift kick in the nuts!
     member.kick(reason)
      .catch(error => message.reply(`An Erorr has occured, please contact AwesomenessZ#3945: ${error}`));
    message.channel.send(`${member.user.tag} has been kicked by ${message.author.tag} for: ${reason}`);

  },
};
