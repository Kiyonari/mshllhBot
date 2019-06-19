var Command = require("../Command.js")

class Start extends Command {
	canExec(message, args) {
		if (this.game.status == 'init') {
			return true
		}
		this.globals.log.send(`Il faudrait d'abord initialiser le jeu avant de le lancer <@${message.author.id}> :thinking:`)
		return false
	}

	exec(message, args) {
		this.globals.log.send(`C'est tipar !`)
		this.game.status = 'start'
	}
}

module.exports = new Start({
	id: 'start',
	required_status: 'start',
	authorized_channels: ['lobby']
})
