const BaseModule = require("./BaseModule.js")

class DidYouCallMe extends BaseModule {
	canProcess(message) {
		return message.mentions.users.exists("id", this.constants.bot_id);
	}

	process(message) {
		message.channel.send("On m'appelle ?")
	}
}

module.exports = new DidYouCallMe({
	triggered_at: "message",
	trigger_probability: 30,
	triggered_when_command: false
})
