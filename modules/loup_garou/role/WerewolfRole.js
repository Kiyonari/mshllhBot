var Role = require("../Role.js")

class WerewolfRole extends Role {
	playStartTurn() {
		this.globals.channels.get('lobby').send("werewolf start turn")
		this.game.nextTurn()
	}

	playDefaultTurn() {
		this.globals.channels.get('lobby').send("werewolf default turn")
		this.discord.channel.send(`${this.getPlayersMentionList()}allez hop hop hop on relève le nez de son tapis et on choisit son prochain martyr !`)
		setTimeout(() => this.discord.channel.enable(), 500)
		this.game.waiting_command = 'kill'
	}

	getPlayersMentionList() {
		var txt = ''
		for (var m of this.globals.members.findByRole('werewolf')) {
			txt += `<@${m.discord.id}> `
		}
		return txt
	}
}

module.exports = new WerewolfRole({
	id: 'werewolf',
	name: "Terroriste",
	ratio: 0.4,
	mandatory: true
})
