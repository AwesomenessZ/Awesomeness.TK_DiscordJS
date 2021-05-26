async function removeStatus(identifier) {
  return;
  //To be fixed after v12 upgrade
  const Keyv = require("keyv");
  const id = new Keyv("sqlite://commands/db/discordbot_Identifers.db");
  var index = await id.get("index");
  if (!index) {
    index = [];
  }
  var guildSCH;
  if (!identifier) {
    var loadchannel = client.channels.cache.get("627880075140005908");
    loadchannel.send(
      "Could not delete status message in a channel that no longer exists"
    );
    return;
  }

  const valueToRemove = index[identifier];
  const filteredItems = index.filter(item => item !== valueToRemove);
  await id.set("index", filteredItems);
  var loadchannel = client.channels.cache.get("627880075140005908");
  loadchannel.send(
    `Deleted ${valueToRemove} (id: ${identifier}) as the channel no longer exists!`
  );
}

async function checkreminders() {
  const remindersdb = new Keyv("sqlite://commands/db/reminders.db");
}