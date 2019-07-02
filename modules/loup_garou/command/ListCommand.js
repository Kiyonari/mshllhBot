var Command = require("../Command.js")

class ListCommand extends Command {
	canExec(message, args) {
		return true
	}

	exec(message, args) {
		var author = this.globals.members.get(message.author.id)
		var channel = this.globals.channels.getByDiscordId(message.channel.id)

		if (author && channel) {
			var txt = ""
			console.log("author: " + author.nickname + ", " + author.role.id)
			for (var member of this.globals.members.all()) {
				console.log("creating line for " + member.nickname + " (role: " + member.role.id + ") in channel: " + (channel.id == author.role.id + "-channel") + ")")
				var line = `**${member.nickname}**${channel.id == author.role.id + "-channel" ? this.getFeature(member, author) : ''}\n`
				txt += line
			}
			txt += "\n"
			for (var dead of this.globals.members.dead()) {
				var line = `:skull_crossbones: **${dead.nickname}**: _${dead.role.name}_\n`
				txt += line
			}
			channel.send(txt)
		}
	}

	getFeature(member, author) {
		switch (author.role.id) {
			case 'werewolf':
				return member.role.id == 'werewolf' ? `: _${member.role.name}_` : ''
			case 'cupidon':
				return ""
			case 'clairvoyant':
//				return this.globals.roles.get('clairvoyant').wasMemberRevealed(member.id) ? `: _${member.role.name}` : ''
			default:
				return ""
		}
	}
}

module.exports = new ListCommand({
	id: 'list',
	overwrites_waiting_command: true,
	authorized_channels: ['lobby', 'general', 'history', 'werewolf-channel', 'villager-channel', 'clairvoyant-channel', 'witch-channel', 'hunter-channel', 'cupidon-channel']
})
