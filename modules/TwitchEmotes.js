const BaseModule = require("./BaseModule.js")
const Emotes = require("../resources/twitch_emotes.json")

const TwitchUrl = "https://static-cdn.jtvnw.net/emoticons/v1/"
const TwitchSize = "/3.0"

class TwitchEmotes extends BaseModule {
	getEmoteNumber(message) {
		let msgarray = message.content.split(" ");
		for (var i = 0, len = msgarray.length; i < len; i++) {
			if (msgarray[i] in Emotes)
				return Emotes[msgarray[i]];
		}
		return undefined;
	}
	
	canProcess(message) {
		return this.getEmoteNumber(message) !== undefined ? true : false;
	}

	process(message) {
	  let emoteNumber = this.getEmoteNumber(message);
	  let url = TwitchUrl + emoteNumber + TwitchSize;
	  message.channel.send(url);
	}
}

module.exports = new TwitchEmotes({
	triggered_at: "message"
})
