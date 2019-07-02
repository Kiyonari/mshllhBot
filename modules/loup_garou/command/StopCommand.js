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
		// if (this.game.status != "init") {
		// 	for (var id of this.globals.members.registered_members) {
		// 		this.globals.discord.getGuildMember(id).removeRole(this.globals.discord.dead_role)
		// 		this.globals.discord.getGuildMember(id).addRole(this.globals.discord.admin_role)
		// 	}
		// }
		this.globals.log.send("Stoppé ! De toute façon vous êtes tous nuls donc bon")
		this.reset()
		this.game.status = 'stop'
	}

	reset() {
		this.globals.channels.reset()
		this.globals.members.reset()
		this.globals.roles.reset()
		this.globals.members.reset()
		this.game.initialized = false
		this.game.waiting_command = null
	}
}

module.exports = new StopCommand({
	id: 'stop',
	authorized_channels: ['lobby'],
	overwrites_waiting_command: true
})