//Master Miner Chat
client.on("message", message => {
  //If receving from server
  if (message.channel.id == 477855444447264780) {
    newlog(message);
  }

  //If sending to server
  if (message.channel.id != 674748183074832405) return; //If the message is not intended for the bot we stop processing it
  if (message.member == null) return; //If they arent a member of the guilde (Ex: Webhook)
  if (message.attachments.size > 0) {
    sendattachment(message);
    return;
  }
  if (
    !message.member.roles.some(r =>
      ["Dev", "🔰 Staff 🔰", "verified"].includes(r.name)
    )
  ) {
    return;
  }
  sendmessage(message);
});

async function sendwebhook(username, avatar, msg) {
  const channel = client.channels.get("674748183074832405");
  try {
    const webhooks = await channel.fetchWebhooks();
    const webhook = webhooks.first();
    await webhook.send(msg, {
      username: username,
      avatarURL: avatar
    });
  } catch (error) {
    console.error("Error trying to send: ", error);
  }
}

//Sending to New Server
async function sendtoservers(command) {
  const { curly } = require("node-libcurl");
  const querystring = require("querystring");
  await curly.post("https://edroid.me/projects/rcon++/beta/client.php", {
    //Curl post content to send
    postFields: querystring.stringify({
      ip: "direct.awesomeness.tk",
      port: "19132",
      password: "OFpZT05GNg==",
      command: `${command}`
    })
  });
  //Sending to OLD PM
  await curly.post("https://edroid.me/projects/rcon++/beta/client.php", {
    //Curl post content to send
    postFields: querystring.stringify({
      ip: "prisonminer.leet.cc",
      port: "56100",
      password: "OFpZT05GNg==",
      command: `${command}`
    })
  });
}

async function newlog(message) {
  var username;
  var args;
  var avatar;
  if (message.content.startsWith("***")) {
    args = message.content.slice(3);
    var guild = message.guild;
    args = args.split(" ");
    if (args[1] == "Pairing") {
      discordlinking(args, guild);
    }
    return;
  }
  if (message.content.startsWith("```")) {
    /*args = message.content.slice(3)
		args = args.split(' ')
		username = args[0]
		avatar = await findavatar(message,username)
		if(args[1] == "left")	msg = "***Left the game***"
		if(args[1] == "joined")	msg = "***Joined the game***"
		if(msg != undefined ){
		sendwebhook(username, avatar, msg)} */
    return;
  }
  args = message.content.split(" ");
  username = args[0];
  for (var i = 0; i < 5; i++) {
    args.shift();
  }
  for (var c = 0; c < args.length; c++) {
    if (args[c].startsWith("@")) {
      var mention = client.users.find("username", args[c].replace("@", ""));
      if (mention) {
        args[c] = `<@${mention.id}>`;
      }
    }
  }
  var msg = args.join(" ");
  if (msg.includes("@here") || msg.includes("@everyone")) {
    sendtoservers(
      `kick ${username} Trying to @\\here or @\\everyone on discord.`
    );
    sendtoservers(
      `message §6[§4ALERT§6] §e ${username} §b tryed to mass mention!`
    );
    msg = msg.replace("@here", "{PING}");
    msg = msg.replace("@everyone", "{PING}");
    var notice = client.channels.get("478288700833398790");
    notice.send({
      embed: {
        color: message.guild.me.displayColor,
        timestamp: new Date(),
        title: `WARNING:`,
        footer: {
          text: `Mass ping attempt by ${username}`
        },
        fields: [
          {
            name: "Minecraft Name:",
            value: username
          },
          {
            name: `Message:`,
            value: `${msg}`
          }
        ]
      }
    });
    return;
  }
  avatar = await findavatar(message, username);
  //Sending the Webhook
  sendwebhook(username, avatar, msg);
}

async function discordlinking(args, guild) {
  const links = new Keyv("mongodb://localhost:27017/mmchat");
  var discordname = args[4].replace(/&/g, " ");
  var mcname = args[2];
  console.log(mcname + " " + discordname);
  var discord_user = client.users.find("username", discordname);
  if (!discord_user) {
    sendtoservers(
      `cmd run inform ${mcname} §cPairing Failed! We could not find your discord account! Please make sure that you have join the Discord Server!`
    );
    console.log(`Failed to pair ${mcname} with ${discordname}`);
    failure(mcname, discordname);
    return;
  }
  var discord_userid = discord_user.id;

  var olddis = await links.get(mcname);
  if (!isNaN(olddis)) {
    const role = guild.roles.get("675120260676059147");
    discord_user = guild.members.get(olddis);
    discord_user.removeRole(role);

    await links.delete(olddis);
    await links.delete(mcname);
  }

  links.set(mcname, discord_userid);
  links.set(discord_userid, mcname);

  const role = guild.roles.get("675120260676059147");
  discord_user = guild.members.get(discord_userid);
  discord_user.addRole(role);
  sendtoservers(
    `cmd run inform ${mcname} §aPairing completed! Your chat messages will now contain your profile picture and you can now talk on the server from discord!`
  );
  success(mcname, discord_user);
}

async function minecraftfind(id) {
  const links = new Keyv("mongodb://localhost:27017/mmchat");
  var username = await links.get(id);
  if (username) {
    return username;
  }
  return false;
}

async function discordfind(username) {
  const links = new Keyv("mongodb://localhost:27017/mmchat");
  var id = await links.get(username);
  if (id) {
    return id;
  }
  return false;
}

async function sendmessage(message) {
  var msgto = message.content;
  if (msgto.includes("<@")) {
    msgto = msgto.split(" ");
    for (var c = 0; c < msgto.length; c++) {
      if (msgto[c].startsWith("<@")) {
        var temp = msgto[c].replace("<@", "");
        temp = temp.replace(">", "");
        temp = temp.replace("!", "");
        temp = temp.replace(",", "");
        temp = temp.replace(".", "");
        temp = client.users.find("id", temp);
        msgto[c] = "@" + temp;
      }
    }
    msgto = msgto.join(" ");
  }
  var userto = message.member.displayName;
  var mcuser = await minecraftfind(message.member.id);
  if (mcuser != false) {
    userto = mcuser;
  }
  sendtoservers(`cmd run from_discord ${userto} ${msgto}`);
}

async function findavatar(message, username) {
  var avatar =
    "https://discordapp.com/assets/dd4dbc0016779df1378e7812eabaa04d.png";
  if (client.users.get("displayName", username) != undefined) {
    avatar = client.users.get("displayName", username).user.avatarURL;
  }
  var id = await discordfind(username);
  if (id > 1000) {
    avatar = client.users.get(id).avatarURL;
  }
  return avatar;
}

async function sendattachment(message) {
  var attached = message.attachments.array();
  const msgto = message.content + " " + attached[0].filename;
  var userto = message.member.displayName;
  var mcuser = await minecraftfind(message.member.id);
  if (mcuser != false) {
    userto = mcuser;
  }
  sendtoservers(`cmd run from_discord ${userto} ${msgto}`);
}

function success(mcname, discord_user) {
  var loadchannel = client.channels.get("477855444447264780");
  loadchannel.fetchMessages({ limit: 1 }).then(messages => {
    let message = messages.first();
    loadchannel.send({
      embed: {
        color: message.guild.me.displayColor,
        timestamp: new Date(),
        title: `Pairing Success!`,
        footer: {
          text: `Requested by ${discord_user.displayName}`,
          icon_url: discord_user.user.avatarURL
        },
        fields: [
          {
            name: "Minecraft Name:",
            value: mcname
          },
          {
            name: `Discord infromation:`,
            value: `( <@${discord_user.id}> ) \n Id: ${discord_user.id} \n Tag: ${discord_user.user.tag} \n Joined time: ${discord_user.joinedAt}`
          }
        ]
      }
    });
  });
}

function failure(mcname, discordname) {
  var loadchannel = client.channels.get("477855444447264780");
  loadchannel.fetchMessages({ limit: 1 }).then(messages => {
    let message = messages.first();
    loadchannel.send({
      embed: {
        color: message.guild.me.displayColor,
        timestamp: new Date(),
        title: `Pairing Failed!`,
        footer: {
          text: `Requested by ${mcname}`
        },
        fields: [
          {
            name: "Minecraft Name",
            value: mcname
          },
          {
            name: "Discord infromation",
            value: `"Username": ${discordname}`
          }
        ]
      }
    });
  });
}
