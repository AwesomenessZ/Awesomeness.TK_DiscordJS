//Support for MoleRatArchives
if (message.channel.id == 582073429809692682) {
  var loadchannel = client.channels.get("654465946395607100");
  var loadchannel2 = client.channels.get("693165889914405004");
  if (message.attachments.size > 0) {
    var attached = message.attachments.array();
    var content = ": " + message.content;
    for (var i = 0; i < attached.length; i++) {
      //MoleRatArchives`
      loadchannel.send({
        embed: {
          color: message.guild.me.displayColor,
          timestamp: new Date(),
          title: `New Image in Art Channel`,
          footer: {
            text: `Posted by ${message.member.displayName}`,
            icon_url: message.author.avatarURL
          },
          image: {
            url: attached[i].url
          },
          fields: [
            {
              name: "File Details:",
              value: `${attached[i].filename}, ${Math.round(
                attached[i].filesize / 1040
              )}kb`
            },
            {
              name: "Included Message:",
              value: `${content}`
            }
          ]
        }
      });
      //AwesomenesZ Archives
      loadchannel2.send({
        embed: {
          color: message.guild.me.displayColor,
          timestamp: new Date(),
          title: `New Image in Art Channel`,
          footer: {
            text: `Posted by ${message.member.displayName}`,
            icon_url: message.author.avatarURL
          },
          image: {
            url: attached[i].url
          },
          fields: [
            {
              name: "File Details:",
              value: `${attached[i].filename}, ${Math.round(
                attached[i].filesize / 1040
              )}kb`
            },
            {
              name: "Included Message:",
              value: `${content}`
            }
          ]
        }
      });
    }
  }
  if (message.attachments.size == 0) {
    //loadchannel.send(message.content)
  }
}
