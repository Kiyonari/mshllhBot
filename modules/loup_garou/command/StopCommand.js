var Command = require("../Command.js")

class StopCommand extends Command {
	canExec(message, args) {
		if (this.game.status != 'stop') {
			return true
		}
		this.globals.log.send(`Le jeu a déjà été stoppé <@${message.author.id}> :/`)
		return false
	}

	exec(message, args) {
		if (this.game.status == 'start') {
			this.globals.members.all((m) => (m.addAdminRole()))
		}
		this.globals.log.send("Stoppé ! De toute façon vous êtes tous nuls donc bon")
		this.reset()
		this.game.status = 'stop'
	}

	reset() {
		this.globals.members.reset()
		this.globals.channels.reset()
		this.globals.roles.reset()
		this.globals.members.reset()
		this.game.initialized = false
	}
}

module.exports = new StopCommand({
	id: 'stop',
	authorized_channels: ['lobby']
})
