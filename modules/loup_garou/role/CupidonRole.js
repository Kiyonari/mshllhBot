var Role = require("../Role.js")

class CupidonRole extends Role {
	playStartTurn() {
		this.game.turn.waiting_command = "marry"
	}

	playDefaultTurn() {
	}
}

module.exports = new CupidonRole({
	id: 'cupidon',
	name: "Bébé avec un arc qui vole",
	ratio: 0.1,
	fixed_number: 1,
})
