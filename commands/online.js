module.exports = {
  //Defines properties of the command
  name: "online",
  aliases: ["who", "server", "on", "current"],
  description:
    "Check statistics for your minecraft bedrock server (Will only update every 3 minutes)",
  guildOnly: true,
  //Code to be run Asyncrously when command is invoked
  async execute(message, args, displayColor) {
    const Keyv = require("keyv");
    //Loads the needed database
    const apikey = new Keyv("sqlite://commands/db/apikeys.db");
    //Start typing so that the user knows the bot is working
    message.channel.startTyping();
    //Find what server we are in so that we can load the correct config
    var guild = message.guild.id;
    var guildapi = await apikey.get(guild);
    //If the guild config hasnt been set up yet, tell them how to do so
    if (!guildapi) {
      message.channel.send(
        `An api key hasn't been provided for this discord server! (${message.guild.name})\nAdd it with /apikey <key>`
      );
      //Stop typing so that we dont have an infnitly typing bot
      message.channel.stopTyping(true);
    }
    //If their is a server config set
    if (guildapi) {
      //Setup our curl request to the api
      const { curly } = require("node-libcurl");
      //Requesting a speicifc url based on the config
      //This will return with json that we can use for displaying infromation
      const { data } = await curly.get(
        `https://minecraftpocket-servers.com/api/?object=servers&element=detail&key=${guildapi}`
      );
      //Convert the result to somthing more useable
      const json = data;
      const jsn = JSON.parse(json);
      //send a Rich chat message based on the received infromation
      message.channel.send({
        embeds: {
          color: displayColor,
          timestamp: new Date(),
          title: `${jsn.name}'s status:`,
          footer: {
            //Shows the name of the server in which infromation is being gathered
            text:
              `Requested by ${message.author.username} • ` +
              (new Date().getTime() - message.createdTimestamp) +
              " ms",
            icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
          },
          image: {
            //Grabs the server banner
            url: `https://minecraftpocket-servers.com/server/${jsn.id}/banner-${jsn.id}.gif`
          },
          fields: [
            {
              //Displays the number of players currently online according to the api
              name: "Online players:",
              value: `**__${jsn.players}/${jsn.maxplayers}__**`
            },
            {
              //Showing the current rankings of the server acording to the api
              name: "Ranking:",
              value: `With ${jsn.votes} votes it currently ranks #${jsn.rank}. Vote on [this website!](${jsn.url}vote)`
            }
          ]
        }
      });
      //Stops typing so that the bot indicates that it is done executing
      message.channel.stopTyping(true);
    }
  }
};
