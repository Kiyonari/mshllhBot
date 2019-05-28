const constants = require("./constants.js")

module.exports = {
	events: ["message", "messageDelete", "messageUpdate"],
	modules: [],
	events_configuration: {
		'message': function(message) {
			return !message.author.bot && message.author.id != constants.bot_id
		},
		'messageDelete': function(message) {
			return true
		},
		'messageUpdate': function(old_m, new_m) {
			return true
		}
	}
}
