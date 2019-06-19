var Command = require("../Command.js")
const Utils = require("../../../Utils.js")

class RegisterCommand extends Command {
	canExec(message, args) {
		if (this.game.status == 'init') {
			if (this.globals.members.get(message.author.id)) {
				this.globals.log.send(`<@${message.author.id}> tu croyais m'avoir, on se register pas 2 fois comme ça ici :rage:`)
				return false
			}
			return true
		} else {
			this.globals.log.send(`Déso <@${message.author.id}>, ça a déjà commencé ou c'est pas encore lancé !`)
		}
		return true
	}

	exec(message, args) {
		var member = message.author
		var guild_member = this.globals.discord.getGuildMember('id', message.author.id)
		var nickname = guild_member.nickname ? guild_member.nickname : member.username
		this.globals.members.create({nickname: nickname, discord: {id: member.id }})
		this.globals.log.send(`**${nickname}** a rejoint la partie, ${["on s'enjaille", "on s'amuse", "vous pouvez quitter du coup"][Utils.rand(2)]}`)
	}
}

module.exports = new RegisterCommand({
	id: 'register',
	required_status: 'register',
	authorized_channels: ['lobby']
})
