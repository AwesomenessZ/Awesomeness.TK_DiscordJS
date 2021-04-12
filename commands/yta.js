module.exports = {
  //Defines properties
  name: "yta",
  description: "Plays Audio from youtube videos!",
  args: false,
  aliases: [
    "youtube",
    "play",
    "y",
    "p",
    "stop",
    "s",
    "skip",
    "q",
    "np",
    "queue",
    "v",
    "volume",
    "pause",
    "r",
    "remove"
  ],
  usage: "play <url>/<search> | stop | skip | queue | pause | resume | volume",
  //code to be executed
  execute(
    message,
    args,
    displayColor,
    client,
    queues,
    connection,
    dispatchers
  ) {
    sliced = message.content.split(" ");
    var sliced = sliced[0].slice(1);
    if (sliced != "youtube" && sliced != "yta" && sliced != "y") {
      args.unshift(sliced);
    }
    if (args[0] == "play" || args[0] == "p") {
      if (!args[1]) {
        if (message.member.voiceChannel) {
          if (message.member.voiceChannel.members.has(client.user.id)) {
            if (dispatchers[message.guild.id]) {
              dispatchers[message.guild.id].resume();
              sendembed(
                {
                  embed: {
                    color: displayColor,
                    title: `${message.guild.name}'s Music has been resumed!'`,
                    //sets the time of the request being made
                    timestamp: new Date(),
                    footer: {
                      text: `Requested by ${message.author.username}`,
                      icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                    }
                  }
                },
                client,
                message
              );
            } else {
              message.reply("Usage: /yta p <url> or /yta p <search query>");
            }
          } else {
            message.reply("Usage: /yta p <url> or /yta p <search query>");
          }
        } else {
          message.reply("Usage: /yta p <url> or /yta p <search query>");
        }
        return;
      }
      var search = args;
      if (message.member.voiceChannel) {
        var link = args[1];
        var vc = message.member.voiceChannel;
        const YouTube = require("simple-youtube-api");
        const youtube = new YouTube("AIzaSyAWRX5cdyVUJUfeAeDPhYbM8sUPbLR7EVA");
        if (validateYouTubeUrl(args)) {
          youtube
            .getVideo(link)
            .then(video => {
              play(
                message,
                connection,
                vc,
                link,
                displayColor,
                queues,
                dispatchers,
                video
              );
              sendembed(
                {
                  embed: {
                    color: displayColor,
                    url: `https://youtube.com/watch?v=${video.id}`,
                    //sets the time of the request being made
                    timestamp: new Date(),
                    title: `Added to Queue in ${vc.name}:`,
                    footer: {
                      text: `Requested by ${message.author.username}`,
                      icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                    },
                    fields: [
                      {
                        name: video.title,
                        value: video.description.substring(0, 50) + "..."
                      }
                    ]
                  }
                },
                client,
                message
              );
            })
            .catch(console.log);
        } // End of direct Link
        else {
          // If not a direct link
          link = search.shift();
          search = search.join(" ");
          youtube
            .searchVideos(search, 2)
            .then(results => {
              sendembed(
                {
                  embed: {
                    color: displayColor,
                    url: `https://youtube.com/watch?v=${results[0].id}`,
                    //sets the time of the request being made
                    timestamp: new Date(),
                    title: `Added to Queue in ${vc.name}:`,
                    footer: {
                      text: `Requested by ${message.author.username}`,
                      icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                    },
                    fields: [
                      {
                        name: results[0].title,
                        value: results[0].description.substring(0, 50) + "..."
                      }
                    ]
                  }
                },
                client,
                message
              );
              link = `https://youtube.com/watch?v=${results[0].id}`;
              play(
                message,
                connection,
                vc,
                link,
                displayColor,
                queues,
                dispatchers,
                results[0]
              );
            })
            .catch(console.log);
        }
        return;
      } else {
        message.reply("Your not in a vc!");
      }
      return;
    } //End of play
    if (args[0] == "stop" || args[0] == "leave") {
      if (message.member.voiceChannel) {
        var vc = message.member.voiceChannel;
        vc.leave();
        queues[message.guild.id] = [];
        connection[message.guild.id] = null;
      } else {
        message.reply("Your not in a vc!");
      }
      return;
    } //End of stop
    if (args[0] == "skip" || args[0] == "s") {
      if (message.member.voiceChannel) {
        if (message.member.voiceChannel.members.has(client.user.id)) {
          dispatchers[message.guild.id].end();
          sendqueue(message, queues, displayColor, client);
        } else {
          message.channel.send("I'm not in a voice channel with you!");
        }
      } else {
        message.channel.send("Your not in a voice channel!");
      }
      return;
    } //End of skip
    if (
      args[0] == "queue" ||
      args[0] == "q" ||
      args[0] == "np" ||
      args[0] == "nowplaying"
    ) {
      if (args[1] == "r" || args[1] == "remove") {
        if (queues[message.guild.id][args[2]]) {
          sendembed(
            {
              embed: {
                color: displayColor,
                title: `Removed #${args[2]}, ${
                  queues[message.guild.id + "_names"][args[2]]
                }`,
                //sets the time of the request being made
                timestamp: new Date(),
                footer: {
                  text: `Requested by ${message.author.username}`,
                  icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                }
              }
            },
            client,
            message
          );
          queues[message.guild.id].splice(args[2], 1);
          queues[message.guild.id + "_names"].splice(args[2], 1);
          return;
        } else return message.channel.send("There is nothing there!");
      }
      if (queues[message.guild.id]) {
        if (queues[message.guild.id][0]) {
          sendqueue(message, queues, displayColor, client);
        } else message.reply("There is no active queue!");
      } else message.reply("There is no active queue!");
      return;
    } // End of queue
    if (args[0] == "v" || args[0] == "volume") {
      if (message.member.voiceChannel) {
        if (message.member.voiceChannel.members.has(client.user.id)) {
          var temp = args[1] / 100;
          if (temp >= 0) {
            if (message.member.hasPermission("ADMINISTRATOR")) {
              dispatchers[message.guild.id].setVolumeLogarithmic(args[1] / 100);
              sendvolume(args[1] / 100, message, displayColor, client);
              queues[message.guild.id + "_v"] = args[1] / 100;
            } else {
              if (temp > 0.5) {
                dispatchers[message.guild.id].setVolumeLogarithmic(0.5);
                message.reply(
                  "You are not an administrator! You are limited to setting the volume up to 50%!"
                );
                sendvolume(0.5, message, displayColor, client);
                queues[message.guild.id + "_v"] = 0.5;
              } else {
                dispatchers[message.guild.id].setVolumeLogarithmic(
                  args[1] / 100
                );
                sendvolume(args[1] / 100, message, displayColor, client);
                queues[message.guild.id + "_v"] = args[1] / 100;
              }
            }
          } else {
            //If volume is 0 or below
            return message.reply("How is that even possible?");
          }
        } else {
          message.reply("I'm not in a voice channel with you!");
        }
      } else {
        message.reply("Your not in a voice channel!");
      }
      return;
    } //End of volume
    if (args[0] == "pause") {
      if (message.member.voiceChannel) {
        if (message.member.voiceChannel.members.has(client.user.id)) {
          dispatchers[message.guild.id].pause();
          sendembed(
            {
              embed: {
                color: displayColor,
                title: `${message.guild.name}'s Music has been paused!'`,
                //sets the time of the request being made
                timestamp: new Date(),
                footer: {
                  text: `Requested by ${message.author.username}`,
                  icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                }
              }
            },
            client,
            message
          );
        } else {
          message.reply("I'm not in a voice channel with you!");
        }
      } else {
        message.reply("Your not in a voice channel!");
      }
      return;
    } //End of pause
    if (args[0] == "resume" || args[0] == "r") {
      if (message.member.voiceChannel) {
        if (message.member.voiceChannel.members.has(client.user.id)) {
          if (dispatchers[message.guild.id]) {
            dispatchers[message.guild.id].resume();
            sendembed(
              {
                embed: {
                  color: displayColor,
                  title: `${message.guild.name}'s Music has been resumed!'`,
                  //sets the time of the request being made
                  timestamp: new Date(),
                  footer: {
                    text: `Requested by ${message.author.username}`,
                    icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
                  }
                }
              },
              client,
              message
            );
          } else {
            message.reply("There is nothing to resume!");
          }
        } else {
          message.reply("I'm not in the voice channel with you!");
        }
      } else {
        message.reply("Your not in a voice channel!");
      }
      return;
    } //End of resume
    if (args[0] == "help" || args[0] == "h") {
      message.channel.send({
        embed: {
          color: displayColor,
          url: `https://discord.gg/Tn48N9A`,
          //sets the time of the request being made
          timestamp: new Date(),
          title: `YouTube Audio Help`,
          thumbnail: "",
          footer: {
            text: `Requested by ${message.author.username}`,
            icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
          },
          fields: [
            {
              name: "Base command:",
              value:
                "/yta or /y can be used interchangeably, this also works with /y p (play), /y s (skip), ect.."
            },
            {
              name: "Play:",
              value: "Plays a youtube url or searches for the video!"
            },
            {
              name: "Pause/Resume:",
              value: "This should be self explanatory..."
            },
            {
              name: "Skip:",
              value: "Skips to the next song in the queue!"
            },
            {
              name: "Queue / NowPlaying:",
              value: "Displays a list of whats to come"
            },
            {
              name: "Queue Remove",
              value: "Removes a speicifc item from the queue"
            },
            {
              name: "Stop:",
              value: "Disconnects the bot and clears the queue!"
            },
            {
              name: "Volume:",
              value:
                "Specify the volume in %. The default is `30%` \nWARNING! This can be set as high as you can type! Only Administrators are allowed to set past 50%"
            }
          ]
        }
      });
      return;
    }
    message.channel.send(
      `*${args[0]}* is an unknown sub-command! Please do /yta help`
    );
  }
};

async function play(
  message,
  connection,
  vc,
  link,
  displayColor,
  queues,
  dispatchers,
  video
) {
  if (queues[message.guild.id]) {
    queues[message.guild.id] = queues[message.guild.id].concat(link);
    queues[message.guild.id + "_names"] = queues[
      message.guild.id + "_names"
    ].concat(video.title);
  } else {
    queues[message.guild.id] = [];
    queues[message.guild.id] = queues[message.guild.id].concat(link);
    queues[message.guild.id + "_names"] = [];
    queues[message.guild.id + "_names"] = queues[
      message.guild.id + "_names"
    ].concat(video.title);
  }
  if (!connection[message.guild.id]) {
    vc.join()
      .then(cmd_connection => {
        // Connection is an instance of VoiceConnection
        connection[message.guild.id] = cmd_connection;
        stream(
          message,
          connection,
          vc,
          link,
          displayColor,
          queues,
          dispatchers
        );
      })
      .catch(err => {
        message.channel.send(`I was unable to join <#${message.channel.id}>!`);
        vc.leave();
        connection[message.guild.id] = null;
        console.log(err);
      });
  }
}

async function stream(
  message,
  connection,
  vc,
  link,
  displayColor,
  queues,
  dispatchers
) {
  const ytdl = require("ytdl-core");
  const stream = ytdl(queues[message.guild.id][0], { filter: "audioonly" });
  var parms = new Object();
  parms.volume = ".1";
  parms.bitrate = "auto";
  var dispatcher = connection[message.guild.id].playFile(
    "commands/assets/join.mp3"
  );
  await new Promise(resolve => setTimeout(resolve, 1500));
  dispatcher = connection[message.guild.id].playStream(stream, parms);
  dispatchers[message.guild.id] = dispatcher;
  if (queues[message.guild.id + "_v"]) {
    dispatcher.setVolumeLogarithmic(queues[message.guild.id + "_v"]);
  }
  dispatcher.on("end", () => {
    next(message, connection, vc, link, displayColor, queues, dispatchers);
  });
}

async function next(
  message,
  connection,
  vc,
  link,
  displayColor,
  queues,
  dispatchers
) {
  queues[message.guild.id].shift();
  queues[message.guild.id + "_names"].shift();
  if (queues[message.guild.id].length == 0) {
    vc.leave();
    connection[message.guild.id] = null;
    message.channel.send("Queue is now empty");
  } else {
    stream(message, connection, vc, link, displayColor, queues, dispatchers);
  }
}

async function sendqueue(message, queues, displayColor, client) {
  var meta = titleformat(queues, message);
  var list;
  var playing = meta[0];
  playing = playing.substr(3);
  if (meta[1]) {
    list = meta;
    list.shift();
    if (meta[1]) {
      list = list.join("\n");
    } else {
      list = list.toString();
    }
  } else {
    list = "*None*";
  }
  sendembed(
    {
      embed: {
        color: displayColor,
        title: `Queue for ${message.guild.name}`,
        url: queues[message.guild.id][0],
        //sets the time of the request being made
        timestamp: new Date(),
        footer: {
          text: `Requested by ${message.author.username}`,
          icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        fields: [
          {
            name: "Now Playing:",
            value: playing
          },
          {
            name: "Up comming:",
            value: list
          }
        ]
      }
    },
    client,
    message
  );
}

function titleformat(queues, message) {
  var temp = [];
  for (var i = 0; i < queues[message.guild.id].length; i++) {
    temp.push(i + ". *" + queues[message.guild.id + "_names"][i] + "*");
  }
  return temp;
}

function sendvolume(volume, message, displayColor, client) {
  sendembed(
    {
      embed: {
        color: displayColor,
        //sets the time of the request being made
        timestamp: new Date(),
        footer: {
          text: `Requested by ${message.author.username}`,
          icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        fields: [
          {
            name: "New Volume set:",
            //Takes the current time subtracted by the time the users message was sent
            //Giving us the ping!
            value: volume * 100 + "%"
          }
        ]
      }
    },
    client,
    message
  );
}

function sendembed(embed, client, message) {
  message.channel.send(embed);
  var loadchannel = client.channels.cache.get("761256808102756402");
  loadchannel.send(embed);
}

function validateYouTubeUrl(args) {
  var url = args[1];
  if (url != undefined || url != "") {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      return true;
    } else {
      return false;
    }
  }
}
