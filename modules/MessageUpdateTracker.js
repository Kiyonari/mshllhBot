const BaseModule = require("./BaseModule.js")

class MessageUpdateTracker extends BaseModule {
	canProcess(old_message, new_message) {
	  return new_message.author.id != constants.bot_id && !old_message.content.match(/https:\/\/|http:\/\/|www\./)
	}

	process(old_message, new_message) {
		new_message.channel.send("J'ai tout vu <@" + new_message.author.id + "> <:aerW:456464580328161280>\nEn vrai t'as dit \"" + old_message.content + "\"")
  }
}

module.exports = new MessageUpdateTracker("messageUpdate")