const constants = require("./constants.js")

module.exports = {
	events: ["message", "messageDelete", "messageUpdate"],
	modules: ["Censorship", "MessageUpdateTracker", "DMMshllhSender", "GayCommand", "MashallahImageSender", "MessageUpdateTracker", "NoHomoMessageSender", "PutTheBell", "RandomInteractions", "9GagReplacer", "AsciiReactions", "RTSiTTrist", "Sudoku", "RandomRename", "DidYouCallMe", "LesTerroristesDeThiercelieux"],
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
