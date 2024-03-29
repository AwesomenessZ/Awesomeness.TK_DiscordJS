module.exports = {
  name: "statusmessage",
  description:
    "Sets what message should be automaticly updated by the discordbot. Grab the chanel id and the Message id for the message. Note: This message has to be sent from the bot.",
  aliases: ["status", "update"],
  guildOnly: true,
  args: false,
  usage: "",
  async execute(message) {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.reply(
        "Sorry, you don't have permissions to use this! Only Administrators can assign an apikey!"
      );

    var guild = message.guild.id;
    message.channel.send(
      "The following message will be automaticly updated every 3 minutes:"
    );
    status(guild, message);
  }
};

//Runs /online while saving the message ID and Channel ID to DB
async function status(guild, message) {
  const Keyv = require("keyv");
  const apikey = new Keyv("sqlite://commands/db/apikeys.db");
  message.channel.startTyping();
  var guildapi = await apikey.get(guild);
  if (!guildapi) {
    message.channel.send(
      `An api key hasn't been provided for this discord server! (${message.guild.name})\nAdd it with /apikey <key>`
    );
    message.channel.stopTyping(true);
  }
  if (guildapi) {
    const { curly } = require("node-libcurl");
    const { data } = await curly.get(
      `https://minecraftpocket-servers.com/api/?object=servers&element=detail&key=${guildapi}`
    );
    const json = data;
    const jsn = JSON.parse(json);
    message.channel
      .send({
        embed: {
          color: message.guild.me.displayColor,
          timestamp: new Date(),
          title: `${jsn.name}'s status:`,
          image: {
            url: `https://minecraftpocket-servers.com/server/${jsn.id}/banner-${jsn.id}.gif`
          },
          fields: [
            {
              name: "Online players:",
              value: `**__${jsn.players}/${jsn.maxplayers}__**`
            },
            {
              name: "Ranking:",
              value: `With ${jsn.votes} votes it currently ranks #${jsn.rank}. Vote on [this website!](${jsn.url}vote)`
            }
          ]
        }
      })
      .then(msg => {
        (async () => {
          //Saving the ID and Channel ID of the message
          const statusID = new Keyv(
            "sqlite://commands/db/discordbot_statusID.db"
          );
          const statusCH = new Keyv(
            "sqlite://commands/db/discordbot_statusCH.db"
          );
          const id = new Keyv("sqlite://commands/db/discordbot_Identifers.db");
          var index = await id.get("index");
          if (isNaN(index.length)) {
            index = [0];
          }
          index[index.length] = index[index.length - 1] + 1;
          id.set("index", index);
          statusID.set(index[index.length - 1], msg.id);
          statusCH.set(index[index.length - 1], msg.channel.id);
          console.log(
            "For guild: " +
              guild +
              " msg.id is: " +
              msg.id +
              " and Channel Id is: " +
              msg.channel.id +
              "\n The internal identifier is: " +
              index[index.length - 1]
          );
        })();
      });
    message.channel.stopTyping(true);
  }
}
