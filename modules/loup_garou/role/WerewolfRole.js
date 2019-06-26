var Role = require("../Role.js")

class WerewolfRole extends Role {
	playStartTurn() {
	}

	playDefaultTurn() {
	}
}

module.exports = new WerewolfRole({
	id: 'werewolf',
	name: "Terroriste",
	ratio: 0.4,
	mandatory: true
})
