const BaseModule = require("./BaseModule.js")

class PutTheBell extends BaseModule {
	canProcess(message) {
    return message.content.match(/cloche|cloch|abonne|aboné|abon/)
	}

	process(message) {
	  message.channel.send(":point_right: :bell:")
	}
}

module.exports = new PutTheBell({
	triggered_at: "message",
	trigger_probability: 25,
	triggered_when_command: false
})
