var Command = require("../Command.js")
const Utils = require("../../../Utils.js")

class MarryCommand extends Command {
	canExec(message, args) {
		if (this.game.waiting_command != 'marry') {
			this.globals.log.send(`<@${message.author.id}> tu croyais m'avoir, on ne marie pas 2 personnes comme ça en 2019 :rage:`)
			return false
		} else if (args.length != 2) {
			message.channel.send(`2 personnes, ni plus ni moins !`)
			return false
		} else if (args[0] == args[1]) {
			message.channel.send(`Pas les 2 mêmes :rage:`)
			return false
		} else if (this.globals.members.get(message.author.id).role.id != 'cupidon') {
			message.channel.send(`Il faut être un bébé qui vole avec un arc pour faire ça <@${message.author.id}> :rage:`)
			return false
		}
		return true
	}

	exec(message, args) {
		var m1 = this.globals.members.findUnique((m) => m.nickname == args[0])
		var m2 = this.globals.members.findUnique((m) => m.nickname == args[1])
		if (!m1 || !m2) {
			message.channel.send(`Ce serait bien que les 2 existent et jouent :rage:`)
			return false
		}
		var channel = this.globals.channels.get('cupidon-channel')
		channel.unassign(this.globals.members.get(message.author.id))
		channel.flushed = false
		channel.flush()
		setTimeout(function() {
			channel.assign(m1)
			channel.assign(m2)
			channel.enable()
			m1.marryTo(m2)
			m2.marryTo(m1)
			channel.send(`<@${m1.id}> et <@${m2.id}> sont les deux mariés, c'est formidable :3\nVous avez 10 secondes pour vous faire des papouilles, après on lance la partie !`, 500)
			setTimeout(function() {
				channel.disable()
				channel.game.waiting_command = null
				channel.game.nextTurn()
			}, 10000)
		}, 1000)
	}
}

module.exports = new MarryCommand({
	id: 'marry',
	required_status: 'register',
	authorized_channels: ['cupidon-channel']
})
