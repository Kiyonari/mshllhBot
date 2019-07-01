var Role = require("../Role.js")

class WitchRole extends Role {
	playStartTurn() {
		this.globals.channels.get('lobby').send("witch start turn")
		this.game.nextTurn()
	}

	playDefaultTurn() {
		this.globals.channels.get('lobby').send("witch default turn")
		this.game.waiting_command = null
		this.game.turn.witch_data.dead = null
		if (this.game.turn.werewolf_data.dead) {
			var user = this.globals.members.findByRole('witch')[0]
			var self = this.game.turn.werewolf_data.dead.id == user.id
			var txt = `Bon <@${user.id}>, quelqu'un est mort ! Et ce quelqu'un ${self ? `c'est toi` : `est ${this.game.turn.werewolf_data.dead.nickname}`} !`

			if (this.potion.life) {
				txt += `\n\nTu peux ${self ? 'te' : 'le'} réanimer en faisant un petit ${this.globals.commands.format("use-potion life")}...`
			}
			if (this.potion.death) {
				txt += `\n\nTu peux tuer quelqu'un ~~si t'es un fdp~~ si tu veux, en faisant un petit } :3`
			}

			if (!this.potion.life && !this.potion.death) {
				txt += `\n\nAh mais en fait t'as déjà tout utilisé ! bah tu coup déso, au suivant !`
				this.discord.channel.send(txt)
				this.game.nextTurn()
			} else {
				txt += `\n\nAprès, si t'es pas drôle ou si t'as déjà tout utilisé, tu peux faire un ${this.globals.commands.format("use-potion none")}...`
				this.game.waiting_command = "use-potion"
				this.discord.channel.send(txt)
				setTimeout(() => this.discord.channel.enable(), 500)
			}
		}
	}

	initSpecialized() {
		this.potion = {
			life: true,
			death: true
		}
	}
}

module.exports = new WitchRole({
	id: 'witch',
	name: "Chimiothérapeute",
	fixed_number: 1,
	ratio: 0.1
})
