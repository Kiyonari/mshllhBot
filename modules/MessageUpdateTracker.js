const BaseModule = require("./BaseModule.js")

class MessageUpdateTracker extends BaseModule {
	canProcess(old_message, new_message) {
	  return !old_message.author.bot && !new_message.author.bot && !old_message.content.match(/https:\/\/|http:\/\/|www\./)
	}

	process(old_message, new_message) {
		new_message.channel.send("J'ai tout vu <@" + new_message.author.id + "> <:aerW:456464580328161280>\nEn vrai t'as dit \"" + old_message.content + "\"")
  }
}

module.exports = new MessageUpdateTracker({
	triggered_at: "messageUpdate",
	trigger_probability: 20
})
