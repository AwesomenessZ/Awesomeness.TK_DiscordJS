module.exports = {
	//Defines properties
	name: 'binary',
	description: 'Converts `Text -> Binary` and `Binary -> Text`',
  args: true,
  aliases: ['bin'],
  usage: '<tanslation>',
	//code to be executed
	execute(message, args, displayColor) {
    var string = args.join(" ")
    var translate
			if (isNaN(args[0])){
        //Tranlate to Binary
        translate = text2bin(string)

      }
      else{
        //Translate From binary
        translate = bin2text(string)

      }
	},
};


function text2bin(string) {

}
function bin2text(str) {

var binString = '';

str.split(' ').map(function(bin) {
    binString += String.fromCharCode(parseInt(bin, 2));
  });
return binString;
}
