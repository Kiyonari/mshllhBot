const BaseModule = require("./BaseModule.js")
const Utils = require("../Utils.js")

class RandomRename extends BaseModule {
	process(message) {
		var new_name = message.guild.members.get(message.author.id).nickname
		new_name = "Ce fdp de " + (new_name ? new_name : message.author.username)
		message.guild.members.get(message.author.id).setNickname(Utils.spongeBob(new_name))
	}
}

module.exports = new RandomRename({
	triggered_at: "message",
	trigger_probability: 1,
	triggered_when_command: false
})
