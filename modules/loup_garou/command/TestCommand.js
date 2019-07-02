var Command = require("../Command.js")

class TestCommand extends Command {
	canExec(message, args) {
		return true
	}

	exec(message, args) {
		for (var role of this.globals.discord.guild.roles.array()) {
			console.log(role.name + " attributed to:")
			for (var member of this.globals.discord.guild.members.array()) {
				if (member.roles.find('id', this.globals.discord.admin_role)) {
					console.log("  " + member.nickname)
				}
			}
		}
	}
}

module.exports = new TestCommand({
	id: 'test',
	authorized_channels: ['lobby', 'general', 'history', 'werewolf-channel', 'villager-channel', 'clairvoyant-channel', 'witch-channel', 'hunter-channel', 'cupidon-channel'],
	overwrites_waiting_command: true
})
