const BaseModule = require("./BaseModule.js")

class Censorship extends BaseModule {
    canProcess(message) {
        return !message.content.includes("C'est qui le fdp qui me censure ? On se croirait chez les bolcheviks :rage:");
    }

	process(message) {
    var txt = ""
    if (message.author.id == this.constants.bot_id) {
        txt = "C'est qui le fdp qui me censure ? On se croirait chez les bolcheviks :rage:"
        txt += "\n" + message.content
    } else {
        txt = "Genre t'as cru que t'allais t'en sortir comme ça <@" + message.author.id + ">"
        if (message.content.includes("fdp")) {
            txt += "\nEt puis c'toi le fdp d'abord"
        }
        txt += "\nLe voilà ton message pour la peine: \"" + message.content + "\""
    }
    message.channel.send(txt)
  }
}

module.exports = new Censorship({
    triggered_at: "messageDelete",
	trigger_probability: 20
})
