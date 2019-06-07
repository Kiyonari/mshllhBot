const constants = require("./constants.js")

module.exports = {
	events: ["message", "messageDelete", "messageUpdate"],
	modules: [],
	events_configuration: {
		'message': {
			onEvent: function(message) {
				return true
			},
			onProcess: function(mod, message) {
				if (message.content[0] != constants.command_prefix && message.author.bot ? mod.config.allow_bot_reaction : true) {
					return true
				} else {
					return mod.config.triggered_when_command ? true : false
				}
			}
		},
		'messageDelete': {
			onEvent: function(message) {
				return message.content[0] != constants.command_prefix
			},
			onProcess: function(mod, message) {
				return true
			}
		},
		'messageUpdate': {
			onEvent: function(old_m, new_m) {
				return old_m.content[0] != constants.command_prefix && !old_m.author.bot && !new_m.author.bot && true
			},
			onProcess: function(mod, old_m, new_m) {
				return true
			}
		}
	}
}
