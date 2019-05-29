const BaseModule = require("./BaseModule.js")

class AsciiReactions extends BaseModule {
	canProcess(message) {
    return this.isMadeOfDifferentLetters(message);
	}

	process(message) {
		let emojis = ["0", "🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];
		var str = message.content.toLowerCase();
  	reaction(emojis, str, message);
  }

	isLetter(str) {
  	return str.length === 1 && str.match(/[a-z]/i);
  }

	isMadeOfDifferentLetters(message) {
    var str = message.content.toLowerCase();
	  var letters = [];

    for (var i = 0; i < str.length; i++) {
			if (this.isLetter(str[i]) && !letters.includes(str[i])) {
				letters.push(str[i]);
			} else {
				return false;
			}
		}
		return true;
	}
}

var reaction = function(emojis, str, message) {
	if (str.length === 0) {
		return;
  }
  message.react(emojis[str[0].charCodeAt() - 96]).then(() => reaction(emojis, str.slice(1), message));
}

module.exports = new AsciiReactions({
	triggered_at: "message",
	trigger_probability: 30,
	triggered_when_command: false
})
