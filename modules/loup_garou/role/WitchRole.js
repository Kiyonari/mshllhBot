var Role = require("../Role.js")

class WitchRole extends Role {
	playStartTurn() {
		this.globals.channels.get('lobby').send("witch start turn")
		this.game.nextTurn()
	}

	playDefaultTurn() {
		this.globals.channels.get('lobby').send("witch default turn")
		this.game.nextTurn()
	}
}

module.exports = new WitchRole({
	id: 'witch',
	name: "Chimiothérapeute",
	fixed_number: 1,
	ratio: 0.1
})
