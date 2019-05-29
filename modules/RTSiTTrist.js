const BaseModule = require("./BaseModule.js")

class DMMshllhSender extends BaseModule {
    canProcess(message) {
    	return message.content.includes("😢")
    }
    process(message) {
        message.channel.send("RT si t trist");
    }
}

module.exports = new DMMshllhSender({
	triggered_at: "message",
	trigger_probability: 25,
	triggered_when_command: false
})
