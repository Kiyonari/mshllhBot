var Command = require("../Command.js")
const Utils = require("../../../Utils.js")

class MarryCommand extends Command {
	canExec(message, args) {
		if (this.game.turn.waiting_command == 'marry') {
			if (args.length != 2) {
				message.channel.send(`2 personnes, ni plus ni moins !`)
				return false
			}
			return true
		} else {
			this.globals.log.send(`<@${message.author.id}> tu croyais m'avoir, on ne marie pas 2 personnes comme ça en 2019 :rage:`)
			return false
		}
	}

	exec(message, args) {
		var m1 = this.globals.members.findUnique((m) => m.nickname = args[0])
		var m2 = this.globals.members.findUnique((m) => m.nickname = args[1])
		if (!m1 || !m2) {
			message.channel.send(`Ce serait bien que les 2 existent et jouent :rage:`)
			return false
		}
		var channel = this.globals.channels.get('cupidon-channel')
		channel.unassign(this.globals.members.get(message.author.id))
		channel.assign(m1)
		channel.assign(m2)
		channel.enable()
		channel.show()
		channel.send("Coucou ! Vous êtes tous les 2 mariés, c'est formidable :3\nVous avez 15 secondes pour vous faire des papouilles, après on lance la partie !", 500)
		setTimeout(function() {
			channel.disable()
			channel.game.turn.waiting_command = null
			//channel.game.nextTurn()
		}, 15)
	}
}

module.exports = new MarryCommand({
	id: 'marry',
	required_status: 'register',
	authorized_channels: ['cupidon-channel']
})
