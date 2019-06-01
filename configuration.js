const constants = require("./constants.js")

module.exports = {
	events: ["message", "messageDelete", "messageUpdate"],
	modules: [
		"Censorship",
		"MessageUpdateTracker",
		"DMMshllhSender",
		"GayCommand",
		"MashallahImageSender",
		"MessageUpdateTracker",
		"NoHomoMessageSender",
		"PutTheBell",
		"RandomInteractions",
		"9GagReplacer",
		"AsciiReactions",
		"RTSiTTrist",
		"Sudoku",
		"DidYouCallMe",
		"ScoreHandler",
		"ScoreDisabler",
		"ScoreNotifier"
	],
	events_configuration: {
		'message': {
			onEvent: function(message) {
				return !message.author.bot && message.author.id != constants.bot_id
			},
			onProcess: function(mod, message) {
				if (message.content[0] != constants.command_prefix) {
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
