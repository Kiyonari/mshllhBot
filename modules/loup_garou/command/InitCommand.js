var Command = require("../Command.js")

class InitCommand extends Command {
	canExec(message, args) {
		if (this.game.status == 'stopped') {
			return true
		} else {
		}
		return true
	}

	exec(args) {
		this.globals.log.send(`Allez hop hop hop on fait un ${this.globals.commands.format("register")}, plus vite que ça !`)
	}
}

module.exports = new InitCommand({
	id: 'init',
	required_status: 'init',
	authorized_channels: ['lobby']
})
