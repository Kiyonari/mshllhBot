var Role = require("../Role.js")

class CupidonRole extends Role {
	playStartTurn() {
		this.game.waiting_command = "marry"
		this.discord.channel.enable()
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
