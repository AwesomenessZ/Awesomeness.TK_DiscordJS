module.exports = {
  //Defines properties
  name: "testdb",
  description: "testdb!",
  //code to be executed
  execute(message) {
    message.channel.send(loaddb("discordbot"));
  }
};

function loaddb(dbname) {
  const { dbs } = require("./config.json");
  var dbhost = dbs.host;
  var dbprefix = dbs.prefix;
  var db = dbs[dbname];
  return dbhost;
}
