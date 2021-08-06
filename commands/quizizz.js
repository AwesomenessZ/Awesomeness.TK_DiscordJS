module.exports = {
  //Defines properties
  name: "quizizz",
  description: "Translates quizizz requests into answer keys!",
  args: false,
  aliases: ["quiz", "quizziz"],
  usage: '<URL containing "quizid"> or help',
  //code to be executed
  execute(message, args, displayColor) {
    var temp
    if (
      args[0].startsWith("https://quizizz.com/api/main/gameSummaryRec?quizId=")
    ) {
      temp = args[0];
      temp = temp.replace(
        "https://quizizz.com/api/main/gameSummaryRec?quizId=",
        ""
      );
      quiz(message, temp, displayColor);
      return;
    }
    if (
      args[0].startsWith(
        "https://quizizz.com/api/sumstars/gameSummaryRec?quizId="
      )
    ) {
      temp = args[0];
      temp = temp.replace(
        "https://quizizz.com/api/sumstars/gameSummaryRec?quizId=",
        ""
      );
      quiz(message, temp, displayColor);
      return;
    }
    if (args[0] == "help") {
      message.channel.send({
        embeds: {
          title: "Quizizz Command Help",
          color: displayColor,
          fields: [
            {
              name: "Description",
              value: `The Following is a step by step guide in how to grab the value that this bot needs in order to give you the answer key!`
            }
          ]
        }
      });
      message.channel.send({
        embeds: {
          color: displayColor,
          image: {
            url: "https://i.imgur.com/QFfYeA9.png"
          },
          fields: [
            {
              name: "Step 1",
              value: `Get to the following screen and right click -> Inspect element`
            }
          ]
        }
      });
      message.channel.send({
        embeds: {
          color: displayColor,
          image: {
            url: "https://i.imgur.com/l8cEO4G.png"
          },
          fields: [
            {
              name: "Step 2",
              value: `Go to the network tab and then refresh the page`
            }
          ]
        }
      });
      message.channel.send({
        embeds: {
          color: displayColor,
          timestamp: new Date(),
          image: {
            url: "https://i.imgur.com/anIda6A.png"
          },
          footer: {
            text:
              `Requested by ${message.author.username} • ` +
              (new Date().getTime() - message.createdTimestamp) +
              " ms",
            icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
          },
          fields: [
            {
              name: "Step 3",
              value: `Search for "quizid" and copy the url! Now that you have the url copied simply do \`/quizid <paste>\` and the answer key will be yours!`
            }
          ]
        }
      });
      return;
    } //End of help
    message.channel.send({
      embeds: {
        title: "Quizizz Command functionality",
        color: displayColor,
        timestamp: new Date(),
        thumbnail:
          "https://pbs.twimg.com/profile_images/974240714283454464/Pq7hqAYA_400x400.jpg",
        footer: {
          text:
            `Requested by ${message.author.username} • ` +
            (new Date().getTime() - message.createdTimestamp) +
            " ms",
          icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
        },
        fields: [
          {
            name: "What does this command do?",
            value: `This command allows you t/quizizz https://quizizz.com/api/main/gameSummaryRec?quizId=5e6fcb034f189b001cfadae2o simply copy a value from inspect element from quizizz and returns to you with the link to the answer key!`
          },
          {
            name: "How do I do this?",
            value:
              "You simply need to load up the quizizz game and open inspect element to begin, for step by step instructions do `/quizizz help`"
          },
          {
            name: "Note:",
            value:
              "You are seeing this message because an invalid url or no url was provided"
          }
        ]
      }
    });
  }
};

async function quiz(message, temp, displayColor) {
  const { curly } = require("node-libcurl");
  //Requesting a speicifc url based on the config
  //This will return with json that we can use for displaying infromation
  const { data } = await curly.get(`https://quizizz.com/api/main/quiz/${temp}`);
  //Convert the result to somthing more useable
  const json = data;
  const jsn = JSON.parse(json);
  var image
  if (jsn.data.quiz.info.image) {
    image = jsn.data.quiz.info.image;
  } else
    image =
      "https://cdn-images-1.medium.com/max/1200/1*4RLJWQJKZ4UwrYafUW7PRw.png";
  var avg = Math.round(
    (jsn.data.quiz.stats.totalCorrect / jsn.data.quiz.stats.totalQuestions) *
      100
  );

  message.channel.send({
    embeds: {
      title: "Click for the Quizizz Answer key!",
      url: `https://quizizz.com/admin/quiz/${temp}`,
      color: displayColor,
      timestamp: new Date(),
      thumbnail: {
        url: image
      },
      footer: {
        text:
          `Requested by ${message.author.username} • ` +
          (new Date().getTime() - message.createdTimestamp) +
          " ms",
        icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.png`
      },
      fields: [
        {
          name: "Name:",
          value: `*${jsn.data.quiz.info.name}*`
        },
        {
          name: "Author:",
          value: `*${jsn.data.quiz.createdBy.local.username}*`
        },
        {
          name: "Acurracy:",
          value: `*${jsn.data.quiz.stats.totalPlayers}* players scored an average of *${avg}%* with *${jsn.data.quiz.info.questions.length}* questions`
        }
      ]
    }
  });
}
