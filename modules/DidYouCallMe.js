const BaseModule = require("./BaseModule.js")

class DidYouCallMe extends BaseModule {
	canProcess(message) {
		return message.content.includes("<@" + this.constants.bot_id + ">")
	}

	process(message) {
		message.channel.send("On m'appelle ?")
	}
}

module.exports = new DidYouCallMe({
	triggered_at: "message",
	trigger_probability: 75,
	triggered_when_command: false
})
