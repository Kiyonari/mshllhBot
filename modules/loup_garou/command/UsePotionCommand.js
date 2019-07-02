var Command = require("../Command.js")

class UsePotionCommand extends Command {
	canExec(message, args) {
		if (this.globals.members.get(message.author.id).role.id != 'witch') {
			message.channel.send(`Seules les chimiothérapeutes peuvent faire ça :rage:`)
			return false
		} else if (args.length != 1 && args.length != 2) {
			message.channel.send(`Il faut au moins 1 argument, fais un effort !`)
		} else {
			return true
		}
	}

	exec(message, args) {
		var channel = this.globals.channels.get('witch-channel')
		var role = this.globals.roles.get('witch')

		switch (args[0]) {
			case 'life':
				if (!role.potion.life) {
					channel.send(`Tu as déjà utilisé ta potion de vie, ca compte pas !`)
				} else {
					role.potion.life = false
					channel.send(`Ca marche !`)
					this.game.waiting_command = null
					this.game.turn.werewolf_data.dead = null
					channel.disable()
					this.game.nextTurn()
				}
				break
			case 'death':
				if (args.length != 2) {
					channel.send(`Je n'ai pas le nom de la personne à tuer :cry:`)
					break
				}
				var killed = this.globals.members.findUnique((m) => (m.nickname == args[1]))
				if (!killed) {
					channel.send(`**${args[1]}** n'existe pas :rage:`)
				} else {
					if (!role.potion.death) {
						channel.send(`Tu as déjà utilisé ta potion de mort, ca compte pas !`)
					} else {
						role.potion.death = false
						channel.send(`Ca marche !`)
						this.game.waiting_command = null
						this.game.turn.witch_data.dead = killed
						channel.disable()
						this.game.nextTurn()
					}
				}
				break
			case 'none':
				channel.send(`Ca marche ! ~~T'es nul~~`)
				this.game.waiting_command = null
				this.game.turn.witch_data.dead = null
				channel.disable()
				this.game.nextTurn()
				break
			default:
				channel.send(`Je ne vois pas ce que tu veux dire par \`${args[0]}\`, tu as le choix entre \`life\`, \`death\` et \`none\`, un effort quand même :cry:`)
				break
		}
	}
}

module.exports = new UsePotionCommand({
	id: 'use-potion',
	required_status: 'init',
	authorized_channels: ['witch-channel']
})
