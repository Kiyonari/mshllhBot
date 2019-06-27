var Role = require("../Role.js")

class WerewolfRole extends Role {
	playStartTurn() {
		this.globals.channels.get('lobby').send("werewolf start turn")
		this.game.nextTurn()
	}

	playDefaultTurn() {
		this.globals.channels.get('lobby').send("werewolf default turn")
		this.game.waiting_command = 'kill'
	}
}

module.exports = new WerewolfRole({
	id: 'werewolf',
	name: "Terroriste",
	ratio: 0.4,
	mandatory: true
})
