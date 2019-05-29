const BaseModule = require("./BaseModule.js")
const Utils = require("../Utils.js")

class NoHomoMessageSender extends BaseModule {
	canProcess(message) {
		return message.content.match(/💙|❤|💚|💜|🖤|💛|\\<3|<3/)
	}

	process(message) {
		message.channel.send("#NoHomo bien sûr")
	}
}

module.exports = new NoHomoMessageSender({
	triggered_at: "message",
	trigger_probability: 25,
	triggered_when_command: false
})
