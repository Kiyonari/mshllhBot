const constants = require("./constants.js")

module.exports = {
	events: ["message", "messageDelete", "messageUpdate"],
	modules: ["Censorship", "MessageUpdateTracker", "DMMshllhSender", "GayCommand", "MashallahImageSender", "MessageUpdateTracker", "NoHomoMessageSender", "PutTheBell", "RandomInteractions", "9GagReplacer", "AsciiReactions", "RTSiTTrist", "Sudoku", "RandomRename", "DidYouCallMe", "LesTerroristesDeThiercelieux"],
	events_configuration: {
		'message': function(message) {
			return !message.author.bot && message.author.id != constants.bot_id && message.content[0] != constants.command_prefix
		},
		'messageDelete': function(message) {
			return message.content[0] != constants.command_prefix
		},
		'messageUpdate': function(old_m, new_m) {
			return old_m.content[0] != constants.command_prefix && !old_m.author.bot && !new_m.author.bot && true
		}
	}
}
