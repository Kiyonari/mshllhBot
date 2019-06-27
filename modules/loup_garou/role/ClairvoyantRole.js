var Role = require("../Role.js")

class ClairvoyantRole extends Role {
	playStartTurn() {
		this.globals.channels.get('lobby').send("clairvoyant start turn")
		this.game.nextTurn()
	}

	playDefaultTurn() {
		this.globals.channels.get('lobby').send("clairvoyant default turn")
		this.game.nextTurn()
	}
}

module.exports = new ClairvoyantRole({
	id: 'clairvoyant',
	name: "Témoin de Jéhovah",
	fixed_number: 1,
	ratio: 0.1
})
