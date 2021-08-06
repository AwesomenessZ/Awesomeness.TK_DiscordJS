module.exports = {
  //Defines the command Properties
  name: "off",
  description: "Turns Stuff Off!",
  //code to run
  execute(message) {
    //Thanks the executer for saving power
    message.reply(
      "Thank you for saving power! Feel good about yourself! :smile:"
    );
    //Actually stops the bot from typing if gliched out (Discord now does this automatically after 10 seconds, or when a message is sent)
  }
};
