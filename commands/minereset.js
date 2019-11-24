module.exports = {
	name: 'minereset',
  cooldown: 5,
	description: 'Currently Resets the mines on Specifc Minecraft servers only!',
  guildOnly: true,
  aliases: ['resetmines','mineresets','resetmine'],
	execute(message, args) {
//Has to be in PM Server
    if (message.guild.id !== "445449992795062273") {
      return  message.channel.send({embed: {
    		color: message.guild.me.displayColor,
  			timestamp: new Date(),
        title:`This command can only be run in Specific Guilds ATM! Sorry for the inconvenience!`,
  			footer: {
  				text: `Requested by ${message.member.displayName}`
  						}
  }});
    };
//Role Checking
if(message.member.roles.some(r=>["Dev", "🔰 Staff 🔰", "🛠️ Builder 🛠️", "Head Of Staff", "Owner", "MVP", "🛡️Staff in Training 🛡️"].includes(r.name)) ) {
  // has one of the roles
  const curl = new (require( 'curl-request' ))();
  message.channel.send({embed: {
    color: message.guild.me.displayColor,
    timestamp: new Date(),
    title:`Mines will now be reset`,
    footer: {
      text: `Requested by ${message.member.displayName}`
          }
}});
  curl
  .setBody({
   'ip': 'prisonminer.leet.cc',
   'port': '56100',
   'password': 'WUIwT0o4',
   'command': 'cmd run resetmines'
  })
  .post('https://edroid.me/projects/rcon++/beta/client.php')
  .then(({statusCode, body, headers}) => {
      console.log(statusCode, body, headers)
  })
  .catch((e) => {
      console.log(e);
  });
} else {
  // has none of the roles
  message.channel.send({embed: {
    color: message.guild.me.displayColor,
    timestamp: new Date(),
    title:`This command can only be run by staff! Please ask a staff member to reset the mines!`,
    footer: {
      text: `Requested by ${message.member.displayName}`
          }
          }});
}





	},
};
