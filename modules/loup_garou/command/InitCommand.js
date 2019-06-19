var Command = require("../Command.js")

class InitCommand extends Command {
	canExec(message, args) {
		if (this.game.status == 'stop') {
			return true
		}
		this.globals.log.send(`Le jeu a déjà été initialisé <@${message.author.id}> :/`)
		return false
	}

	exec(message, args) {
		this.globals.log.send(`Allez hop hop hop on fait un ${this.globals.commands.format("register")}, plus vite que ça !`)
		this.globals.commands.get('register').exec(message)
		this.game.status = 'init'
	}
}

module.exports = new InitCommand({
	id: 'init',
	required_status: 'init',
	authorized_channels: ['lobby']
})
